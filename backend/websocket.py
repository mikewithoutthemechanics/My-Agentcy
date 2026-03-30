"""
WebSocket handler for real-time updates.
Clients subscribe to task updates, QA results, agent status.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
import json
import asyncio

router = APIRouter()


class ConnectionManager:
    """Manages WebSocket connections per org."""

    def __init__(self):
        # org_id -> list of websockets
        self.connections: Dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, org_id: str):
        await websocket.accept()
        if org_id not in self.connections:
            self.connections[org_id] = []
        self.connections[org_id].append(websocket)

    def disconnect(self, websocket: WebSocket, org_id: str):
        if org_id in self.connections:
            self.connections[org_id].remove(websocket)
            if not self.connections[org_id]:
                del self.connections[org_id]

    async def broadcast(self, org_id: str, message: dict):
        """Send a message to all connections in an org."""
        if org_id not in self.connections:
            return
        
        dead = []
        for ws in self.connections[org_id]:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        
        for ws in dead:
            self.connections[org_id].remove(ws)

    async def broadcast_all(self, message: dict):
        """Send to all connected clients."""
        for org_id in list(self.connections.keys()):
            await self.broadcast(org_id, message)


manager = ConnectionManager()


@router.websocket("/ws/{org_id}")
async def websocket_endpoint(websocket: WebSocket, org_id: str):
    """
    WebSocket endpoint for real-time updates.
    
    Clients receive:
    - task.status_changed — when a task status changes
    - task.completed — when a task is completed
    - qa.review_ready — when QA review is ready for human review
    - agent.status_changed — when agent status changes
    """
    await manager.connect(websocket, org_id)
    try:
        while True:
            # Keep connection alive, handle client messages
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            # Handle client requests
            if msg.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            elif msg.get("type") == "subscribe":
                # Client subscribing to specific events
                await websocket.send_json({"type": "subscribed", "events": msg.get("events", [])})
    except WebSocketDisconnect:
        manager.disconnect(websocket, org_id)


# Helper functions for broadcasting events from routes
async def notify_task_status(org_id: str, task_id: str, status: str, title: str):
    """Broadcast task status change."""
    await manager.broadcast(org_id, {
        "type": "task.status_changed",
        "task_id": task_id,
        "status": status,
        "title": title,
    })


async def notify_qa_ready(org_id: str, task_id: str, review_id: str, qa_score: int):
    """Broadcast QA review ready for human review."""
    await manager.broadcast(org_id, {
        "type": "qa.review_ready",
        "task_id": task_id,
        "review_id": review_id,
        "qa_score": qa_score,
    })


async def notify_agent_status(org_id: str, agent_id: str, status: str, active_tasks: int):
    """Broadcast agent status change."""
    await manager.broadcast(org_id, {
        "type": "agent.status_changed",
        "agent_id": agent_id,
        "status": status,
        "active_tasks": active_tasks,
    })
