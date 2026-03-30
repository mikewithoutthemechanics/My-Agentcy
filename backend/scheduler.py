"""
My-Agentcy — Internal Agent Scheduler
Runs internal business agents on schedules.
"""

import asyncio
from datetime import datetime, timedelta
from typing import Callable, Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum


class ScheduleType(str, Enum):
    ON_DEMAND = "on_demand"      # Triggered by event
    INTERVAL = "interval"        # Every N minutes
    DAILY = "daily"              # At specific time
    WEEKLY = "weekly"            # Day of week + time
    CONTINUOUS = "continuous"     # Always running


@dataclass
class ScheduledAgent:
    name: str
    schedule_type: ScheduleType
    interval_minutes: Optional[int] = None
    daily_time: Optional[str] = None       # "09:00"
    weekly_day: Optional[str] = None       # "monday"
    weekly_time: Optional[str] = None      # "09:00"
    handler: Optional[Callable] = None
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    enabled: bool = True
    run_count: int = 0
    error_count: int = 0


class AgentScheduler:
    """
    Manages scheduling and execution of internal business agents.
    """

    def __init__(self):
        self.agents: Dict[str, ScheduledAgent] = {}
        self._running = False
        self._history: List[dict] = []

    def register(self, agent: ScheduledAgent):
        """Register an agent with its schedule."""
        agent.next_run = self._calculate_next_run(agent)
        self.agents[agent.name] = agent

    def register_on_demand(self, name: str, handler: Callable):
        """Register an on-demand agent."""
        self.register(ScheduledAgent(
            name=name,
            schedule_type=ScheduleType.ON_DEMAND,
            handler=handler,
        ))

    def register_interval(self, name: str, minutes: int, handler: Callable):
        """Register an interval agent."""
        self.register(ScheduledAgent(
            name=name,
            schedule_type=ScheduleType.INTERVAL,
            interval_minutes=minutes,
            handler=handler,
        ))

    def register_daily(self, name: str, time: str, handler: Callable):
        """Register a daily agent (e.g., '09:00')."""
        self.register(ScheduledAgent(
            name=name,
            schedule_type=ScheduleType.DAILY,
            daily_time=time,
            handler=handler,
        ))

    def register_weekly(self, name: str, day: str, time: str, handler: Callable):
        """Register a weekly agent (e.g., 'monday', '09:00')."""
        self.register(ScheduledAgent(
            name=name,
            schedule_type=ScheduleType.WEEKLY,
            weekly_day=day.lower(),
            weekly_time=time,
            handler=handler,
        ))

    async def trigger(self, name: str) -> dict:
        """Manually trigger an on-demand agent."""
        agent = self.agents.get(name)
        if not agent:
            return {"error": f"Agent '{name}' not found"}

        return await self._run_agent(agent)

    async def start(self, poll_interval: int = 30):
        """Start the scheduler loop."""
        self._running = True
        print(f"🕐 Agent scheduler started ({len(self.agents)} agents registered)")

        while self._running:
            now = datetime.utcnow()
            for agent in self.agents.values():
                if not agent.enabled or not agent.handler:
                    continue
                if agent.schedule_type == ScheduleType.ON_DEMAND:
                    continue
                if agent.next_run and now >= agent.next_run:
                    await self._run_agent(agent)
                    agent.next_run = self._calculate_next_run(agent)

            await asyncio.sleep(poll_interval)

    def stop(self):
        """Stop the scheduler."""
        self._running = False

    async def _run_agent(self, agent: ScheduledAgent) -> dict:
        """Execute an agent and record the result."""
        start = datetime.utcnow()
        result = {"agent": agent.name, "started_at": start.isoformat()}

        try:
            output = await agent.handler() if asyncio.iscoroutinefunction(agent.handler) else agent.handler()
            agent.last_run = start
            agent.run_count += 1
            result["status"] = "success"
            result["output"] = str(output)[:500]
        except Exception as e:
            agent.error_count += 1
            result["status"] = "error"
            result["error"] = str(e)

        result["duration_seconds"] = (datetime.utcnow() - start).total_seconds()
        self._history.append(result)
        return result

    def _calculate_next_run(self, agent: ScheduledAgent) -> Optional[datetime]:
        """Calculate when the agent should next run."""
        now = datetime.utcnow()

        if agent.schedule_type == ScheduleType.INTERVAL:
            if agent.last_run:
                return agent.last_run + timedelta(minutes=agent.interval_minutes)
            return now

        if agent.schedule_type == ScheduleType.DAILY:
            hour, minute = map(int, agent.daily_time.split(":"))
            next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if next_run <= now:
                next_run += timedelta(days=1)
            return next_run

        if agent.schedule_type == ScheduleType.WEEKLY:
            days = {"monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
                    "friday": 4, "saturday": 5, "sunday": 6}
            target_day = days.get(agent.weekly_day, 0)
            hour, minute = map(int, agent.weekly_time.split(":"))
            days_ahead = (target_day - now.weekday()) % 7
            if days_ahead == 0:
                candidate = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
                if candidate <= now:
                    days_ahead = 7
            next_run = now + timedelta(days=days_ahead)
            return next_run.replace(hour=hour, minute=minute, second=0, microsecond=0)

        return None

    def status(self) -> dict:
        """Get scheduler status."""
        return {
            "running": self._running,
            "total_agents": len(self.agents),
            "enabled_agents": sum(1 for a in self.agents.values() if a.enabled),
            "agents": [
                {
                    "name": a.name,
                    "schedule": a.schedule_type.value,
                    "enabled": a.enabled,
                    "last_run": a.last_run.isoformat() if a.last_run else None,
                    "next_run": a.next_run.isoformat() if a.next_run else None,
                    "run_count": a.run_count,
                    "error_count": a.error_count,
                }
                for a in self.agents.values()
            ],
            "recent_runs": self._history[-20:],
        }


# Singleton
scheduler = AgentScheduler()
