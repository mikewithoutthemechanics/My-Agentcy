"""
My-Agentcy — Task Queue System

Priority-based task queue with:
- Priority levels (1-5, 1 = highest)
- Deduplication (same brief = same task)
- Backpressure (max concurrent tasks per org)
- Deadlines (auto-escalate approaching deadlines)
- Retry logic (failed tasks retry with backoff)
"""

import asyncio
import heapq
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Optional, Callable, Any
from enum import IntEnum


class Priority(IntEnum):
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4
    BACKLOG = 5


class TaskStatus(str, Enum):
    QUEUED = "queued"
    CLASSIFYING = "classifying"
    IN_PROGRESS = "in_progress"
    QA_REVIEW = "qa_review"
    HUMAN_REVIEW = "human_review"
    REVISION = "revision"
    APPROVED = "approved"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    FAILED = "failed"


# Need to import Enum for TaskStatus
from enum import Enum


@dataclass(order=True)
class QueuedTask:
    """A task in the queue, ordered by priority then timestamp."""
    priority: int
    queued_at: float = field(compare=True)
    task_id: str = field(compare=False)
    org_id: str = field(compare=False)
    title: str = field(compare=False)
    task_type: str = field(compare=False)
    brief: dict = field(default_factory=dict, compare=False)
    deadline: Optional[datetime] = field(default=None, compare=False)
    retry_count: int = field(default=0, compare=False)
    max_retries: int = field(default=3, compare=False)
    callback: Optional[Callable] = field(default=None, compare=False, repr=False)


class TaskQueue:
    """
    Priority task queue with backpressure and deduplication.
    
    Features:
    - Min-heap by (priority, timestamp) — highest priority first, FIFO within same priority
    - Per-org concurrency limits
    - Deduplication via brief hashing
    - Deadline monitoring
    - Retry with exponential backoff
    """

    def __init__(self, max_concurrent: int = 10, org_concurrency: int = 3):
        self._heap: list[QueuedTask] = []
        self._active: dict[str, QueuedTask] = {}  # task_id → task
        self._completed: list[str] = []
        self._failed: list[str] = []
        self._org_active: dict[str, int] = {}  # org_id → active count
        self._brief_hashes: set[str] = set()  # dedup

        self.max_concurrent = max_concurrent
        self.org_concurrency = org_concurrency
        self._lock = asyncio.Lock()

    async def enqueue(self, task: QueuedTask) -> bool:
        """Add a task to the queue. Returns False if duplicate."""
        async with self._lock:
            # Dedup check
            brief_hash = self._hash_brief(task.brief)
            if brief_hash in self._brief_hashes:
                return False

            self._brief_hashes.add(brief_hash)
            heapq.heappush(self._heap, task)
            return True

    async def dequeue(self) -> Optional[QueuedTask]:
        """
        Get the next task to process.
        Respects concurrency limits and org limits.
        """
        async with self._lock:
            if len(self._active) >= self.max_concurrent:
                return None

            # Find a task that can run (org not at limit)
            skipped = []
            while self._heap:
                task = heapq.heappop(self._heap)
                org_active = self._org_active.get(task.org_id, 0)

                if org_active < self.org_concurrency:
                    # Can run this task
                    self._active[task.task_id] = task
                    self._org_active[task.org_id] = org_active + 1

                    # Put skipped tasks back
                    for t in skipped:
                        heapq.heappush(self._heap, t)

                    return task
                else:
                    skipped.append(task)

            # Put all skipped back
            for t in skipped:
                heapq.heappush(self._heap, t)

            return None

    async def complete(self, task_id: str):
        """Mark a task as completed."""
        async with self._lock:
            task = self._active.pop(task_id, None)
            if task:
                self._org_active[task.org_id] = max(0, self._org_active.get(task.org_id, 1) - 1)
                self._completed.append(task_id)

    async def fail(self, task_id: str, retry: bool = True):
        """Mark a task as failed. Optionally retry with backoff."""
        async with self._lock:
            task = self._active.pop(task_id, None)
            if task:
                self._org_active[task.org_id] = max(0, self._org_active.get(task.org_id, 1) - 1)

                if retry and task.retry_count < task.max_retries:
                    task.retry_count += 1
                    # Exponential backoff: re-queue with lower priority
                    backoff_priority = min(task.priority + task.retry_count, 5)
                    task.priority = backoff_priority
                    heapq.heappush(self._heap, task)
                else:
                    self._failed.append(task_id)

    async def escalate_deadlines(self):
        """Check for approaching deadlines and escalate priority."""
        async with self._lock:
            now = datetime.utcnow()
            escalated = []

            for task in self._heap:
                if task.deadline:
                    hours_left = (task.deadline - now).total_seconds() / 3600
                    if hours_left < 2 and task.priority > 1:
                        task.priority = 1  # Escalate to critical
                        escalated.append(task.task_id)

            if escalated:
                # Rebuild heap after priority changes
                heapq.heapify(self._heap)

            return escalated

    def stats(self) -> dict:
        """Queue statistics."""
        return {
            "queued": len(self._heap),
            "active": len(self._active),
            "completed": len(self._completed),
            "failed": len(self._failed),
            "org_concurrency": dict(self._org_active),
        }

    def _hash_brief(self, brief: dict) -> str:
        """Create a dedup hash from brief content."""
        import hashlib
        import json
        # Sort keys for consistent hashing
        content = json.dumps(brief, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()[:16]


class TaskQueueWorker:
    """
    Worker that processes tasks from the queue.
    Runs as a background task, pulling work and executing it.
    """

    def __init__(self, queue: TaskQueue, processor: Callable):
        self.queue = queue
        self.processor = processor
        self._running = False

    async def start(self, poll_interval: float = 1.0):
        """Start the worker loop."""
        self._running = True
        while self._running:
            # Check deadlines
            await self.queue.escalate_deadlines()

            # Try to get a task
            task = await self.queue.dequeue()
            if task:
                try:
                    await self.processor(task)
                    await self.queue.complete(task.task_id)
                except Exception as e:
                    print(f"Task {task.task_id} failed: {e}")
                    await self.queue.fail(task.task_id)
            else:
                # No tasks available, wait
                await asyncio.sleep(poll_interval)

    def stop(self):
        """Stop the worker loop."""
        self._running = False
