"""
My-Agentcy — Robust Agent Orchestration
Proper agent execution with retry, circuit breaker, and observability.
"""

import asyncio
import time
from datetime import datetime
from typing import Callable, Dict, Any, Optional, List
from dataclasses import dataclass, field
from enum import Enum
import json


class AgentStatus(str, Enum):
    IDLE = "idle"
    ACTIVE = "active"
    ERROR = "error"
    CIRCUIT_OPEN = "circuit_open"


@dataclass
class AgentMetrics:
    """Track agent performance metrics."""
    total_runs: int = 0
    successful_runs: int = 0
    failed_runs: int = 0
    total_tokens: int = 0
    total_cost_usd: float = 0.0
    avg_duration_seconds: float = 0.0
    last_run: Optional[datetime] = None
    last_error: Optional[str] = None

    @property
    def success_rate(self) -> float:
        if self.total_runs == 0:
            return 1.0
        return self.successful_runs / self.total_runs

    @property
    def avg_cost_per_run(self) -> float:
        if self.total_runs == 0:
            return 0.0
        return self.total_cost_usd / self.total_runs


@dataclass
class CircuitBreaker:
    """Circuit breaker to prevent cascading failures."""
    failure_threshold: int = 5
    recovery_timeout_seconds: int = 60
    failure_count: int = 0
    last_failure_time: Optional[datetime] = None
    state: str = "closed"  # closed, open, half_open

    def record_success(self):
        self.failure_count = 0
        self.state = "closed"

    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.utcnow()
        if self.failure_count >= self.failure_threshold:
            self.state = "open"

    def can_execute(self) -> bool:
        if self.state == "closed":
            return True
        if self.state == "open":
            if self.last_failure_time:
                elapsed = (datetime.utcnow() - self.last_failure_time).total_seconds()
                if elapsed >= self.recovery_timeout_seconds:
                    self.state = "half_open"
                    return True
            return False
        # half_open — allow one attempt
        return True

    def on_half_open_result(self, success: bool):
        if success:
            self.record_success()
        else:
            self.state = "open"


class RobustAgent:
    """
    Agent wrapper with retry, circuit breaker, and metrics.
    """

    def __init__(self, agent_id: str, handler: Callable, max_retries: int = 3):
        self.agent_id = agent_id
        self.handler = handler
        self.max_retries = max_retries
        self.status = AgentStatus.IDLE
        self.metrics = AgentMetrics()
        self.circuit_breaker = CircuitBreaker()
        self._active_tasks: List[str] = []

    async def execute(self, task_data: dict, context: dict = None) -> dict:
        """Execute with retry and circuit breaker protection."""
        if not self.circuit_breaker.can_execute():
            return {
                "success": False,
                "error": f"Circuit breaker open for {self.agent_id}",
                "agent_id": self.agent_id,
            }

        self.status = AgentStatus.ACTIVE
        start_time = time.time()
        last_error = None

        for attempt in range(1, self.max_retries + 1):
            try:
                result = await self._run_handler(task_data, context)
                duration = time.time() - start_time

                # Record success
                self.circuit_breaker.record_success()
                self.metrics.total_runs += 1
                self.metrics.successful_runs += 1
                self.metrics.avg_duration_seconds = (
                    (self.metrics.avg_duration_seconds * (self.metrics.total_runs - 1) + duration)
                    / self.metrics.total_runs
                )
                self.metrics.last_run = datetime.utcnow()
                self.status = AgentStatus.IDLE

                return {
                    "success": True,
                    "result": result,
                    "agent_id": self.agent_id,
                    "duration_seconds": round(duration, 2),
                    "attempts": attempt,
                }

            except Exception as e:
                last_error = str(e)
                if attempt < self.max_retries:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff

        # All retries exhausted
        duration = time.time() - start_time
        self.circuit_breaker.record_failure()
        self.metrics.total_runs += 1
        self.metrics.failed_runs += 1
        self.metrics.last_error = last_error
        self.metrics.last_run = datetime.utcnow()
        self.status = AgentStatus.ERROR

        if self.circuit_breaker.state == "open":
            self.status = AgentStatus.CIRCUIT_OPEN

        return {
            "success": False,
            "error": last_error,
            "agent_id": self.agent_id,
            "duration_seconds": round(duration, 2),
            "attempts": self.max_retries,
            "circuit_state": self.circuit_breaker.state,
        }

    async def _run_handler(self, task_data: dict, context: dict = None) -> Any:
        """Run the actual handler."""
        if asyncio.iscoroutinefunction(self.handler):
            return await self.handler(task_data, context or {})
        return self.handler(task_data, context or {})

    def to_dict(self) -> dict:
        return {
            "agent_id": self.agent_id,
            "status": self.status.value,
            "metrics": {
                "total_runs": self.metrics.total_runs,
                "success_rate": round(self.metrics.success_rate * 100, 1),
                "avg_duration_seconds": round(self.metrics.avg_duration_seconds, 2),
                "total_tokens": self.metrics.total_tokens,
                "total_cost_usd": round(self.metrics.total_cost_usd, 4),
                "last_run": self.metrics.last_run.isoformat() if self.metrics.last_run else None,
            },
            "circuit_breaker": {
                "state": self.circuit_breaker.state,
                "failure_count": self.circuit_breaker.failure_count,
            },
        }


class AgentOrchestrator:
    """
    Manages multiple agents and coordinates their execution.
    Supports sequential, parallel, and hierarchical execution.
    """

    def __init__(self):
        self.agents: Dict[str, RobustAgent] = {}

    def register(self, agent_id: str, handler: Callable, max_retries: int = 3):
        """Register an agent."""
        self.agents[agent_id] = RobustAgent(agent_id, handler, max_retries)

    async def run_sequential(self, pipeline: List[tuple]) -> List[dict]:
        """
        Run agents sequentially, passing output of each to the next.
        pipeline: [(agent_id, task_data), ...]
        """
        results = []
        context = {}

        for agent_id, task_data in pipeline:
            agent = self.agents.get(agent_id)
            if not agent:
                results.append({"success": False, "error": f"Agent {agent_id} not found"})
                break

            # Inject previous results as context
            task_data["_context"] = context
            result = await agent.execute(task_data, context)
            results.append(result)

            if not result["success"]:
                break  # Stop pipeline on failure

            context[agent_id] = result.get("result")

        return results

    async def run_parallel(self, tasks: List[tuple]) -> List[dict]:
        """
        Run multiple agents in parallel.
        tasks: [(agent_id, task_data), ...]
        """
        async def run_one(agent_id: str, task_data: dict) -> dict:
            agent = self.agents.get(agent_id)
            if not agent:
                return {"success": False, "error": f"Agent {agent_id} not found"}
            return await agent.execute(task_data)

        coroutines = [run_one(aid, td) for aid, td in tasks]
        return await asyncio.gather(*coroutines)

    async def run_hierarchical(self, manager_id: str, task_data: dict, sub_tasks: List[tuple]) -> dict:
        """
        Manager agent delegates to sub-agents.
        manager coordinates and synthesizes results.
        """
        # Run sub-tasks in parallel
        sub_results = await self.run_parallel(sub_tasks)

        # Feed results to manager for synthesis
        manager = self.agents.get(manager_id)
        if not manager:
            return {"success": False, "error": f"Manager {manager_id} not found"}

        synthesis_data = {
            **task_data,
            "sub_results": sub_results,
        }
        return await manager.execute(synthesis_data)

    def get_agent(self, agent_id: str) -> Optional[RobustAgent]:
        return self.agents.get(agent_id)

    def status(self) -> dict:
        return {
            "total_agents": len(self.agents),
            "agents": {
                aid: agent.to_dict()
                for aid, agent in self.agents.items()
            },
            "active_count": sum(1 for a in self.agents.values() if a.status == AgentStatus.ACTIVE),
            "error_count": sum(1 for a in self.agents.values() if a.status in (AgentStatus.ERROR, AgentStatus.CIRCUIT_OPEN)),
        }


# Singleton
orchestrator = AgentOrchestrator()
