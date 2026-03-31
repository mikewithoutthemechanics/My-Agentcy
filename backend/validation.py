"""
My-Agentcy — Validation & Error Handling
Middleware for request validation, error handling, and response formatting.
"""

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator, Field
from typing import Optional, List, Any
from datetime import datetime
import traceback


# ═══════════════════════════════════════════════════════
# VALIDATION MODELS
# ═══════════════════════════════════════════════════════

class ValidatedTaskCreate(BaseModel):
    """Validated task creation request."""
    title: str = Field(..., min_length=3, max_length=200, description="Task title")
    description: str = Field(..., min_length=10, max_length=5000, description="Detailed description")
    task_type: str = Field(..., description="One of: report, analysis, content, code, research, data_entry")
    priority: int = Field(default=3, ge=1, le=5, description="1=critical, 5=backlog")
    requirements: List[str] = Field(default_factory=list, max_items=20)
    deadline: Optional[str] = None

    @validator("task_type")
    def validate_task_type(cls, v):
        allowed = {"report", "analysis", "content", "code", "research", "data_entry",
                    "strategy", "design", "translation", "summarization", "formatting",
                    "legal", "compliance", "contract", "extraction"}
        if v.lower() not in allowed:
            raise ValueError(f"Invalid task_type. Allowed: {', '.join(sorted(allowed))}")
        return v.lower()

    @validator("requirements", each_item=True)
    def validate_requirement(cls, v):
        if len(v) > 500:
            raise ValueError("Each requirement must be under 500 characters")
        return v


class ValidatedFeedback(BaseModel):
    """Validated feedback submission."""
    rating: int = Field(..., ge=1, le=5)
    feedback: str = Field(default="", max_length=2000)


class ValidatedReview(BaseModel):
    """Validated QA review submission."""
    scores: dict = Field(..., description="Scores dict with accuracy/completeness/format/relevance")
    flags: List[dict] = Field(default_factory=list)
    comments: str = Field(default="", max_length=2000)
    decision: str = Field(..., description="approve, reject, or request_revision")

    @validator("decision")
    def validate_decision(cls, v):
        allowed = {"approve", "reject", "request_revision"}
        if v.lower() not in allowed:
            raise ValueError(f"Invalid decision. Allowed: {', '.join(allowed)}")
        return v.lower()

    @validator("scores")
    def validate_scores(cls, v):
        required_keys = {"accuracy", "completeness", "format", "relevance"}
        for key in required_keys:
            if key not in v:
                raise ValueError(f"Missing score: {key}")
            if not isinstance(v[key], (int, float)) or not (0 <= v[key] <= 100):
                raise ValueError(f"Score '{key}' must be 0-100")
        return v


# ═══════════════════════════════════════════════════════
# ERROR HANDLING
# ═══════════════════════════════════════════════════════

class AppError(Exception):
    """Base application error."""
    def __init__(self, message: str, status_code: int = 500, details: Any = None):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, resource: str, id: str):
        super().__init__(f"{resource} not found: {id}", 404)


class ValidationError(AppError):
    def __init__(self, message: str, details: Any = None):
        super().__init__(message, 422, details)


class AuthorizationError(AppError):
    def __init__(self, message: str = "Not authorized"):
        super().__init__(message, 403)


class RateLimitError(AppError):
    def __init__(self, retry_after: int = 60):
        super().__init__("Rate limit exceeded", 429, {"retry_after": retry_after})


async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global error handler for consistent error responses."""
    if isinstance(exc, AppError):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "message": exc.message,
                "details": exc.details,
                "timestamp": datetime.utcnow().isoformat(),
            },
        )

    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "message": exc.detail,
                "timestamp": datetime.utcnow().isoformat(),
            },
        )

    # Unexpected error
    error_id = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    print(f"Unexpected error [{error_id}]: {traceback.format_exc()}")

    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "error_id": error_id,
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


# ═══════════════════════════════════════════════════════
# RESPONSE HELPERS
# ═══════════════════════════════════════════════════════

def success_response(data: Any, message: str = "Success", status_code: int = 200) -> JSONResponse:
    """Standard success response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "error": False,
            "message": message,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


def paginated_response(items: list, total: int, page: int = 1, per_page: int = 20) -> dict:
    """Paginated response."""
    return {
        "items": items,
        "pagination": {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
        },
    }


# ═══════════════════════════════════════════════════════
# RATE LIMITING
# ═══════════════════════════════════════════════════════

class RateLimiter:
    """Simple in-memory rate limiter."""

    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: Dict[str, List[float]] = {}

    def check(self, key: str) -> bool:
        """Check if request is within rate limit."""
        import time
        now = time.time()

        if key not in self._requests:
            self._requests[key] = []

        # Clean old entries
        self._requests[key] = [t for t in self._requests[key] if now - t < self.window_seconds]

        if len(self._requests[key]) >= self.max_requests:
            return False

        self._requests[key].append(now)
        return True

    def remaining(self, key: str) -> int:
        """Get remaining requests for a key."""
        import time
        now = time.time()
        if key not in self._requests:
            return self.max_requests
        self._requests[key] = [t for t in self._requests[key] if now - t < self.window_seconds]
        return max(0, self.max_requests - len(self._requests[key]))


rate_limiter = RateLimiter(max_requests=60, window_seconds=60)
