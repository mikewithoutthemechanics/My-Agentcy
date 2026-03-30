"""
Auth middleware for My-Agentcy backend.
JWT verification and org-level access control.
"""

from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import jwt
import os

security = HTTPBearer(auto_error=False)

JWT_SECRET = os.getenv("JWT_SECRET", "my-agentcy-dev-secret")
JWT_ALGORITHM = "HS256"


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    """
    Extract and verify JWT token.
    Returns user dict with id, email, org_id, role.
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "org_id": payload.get("org_id"),
            "role": payload.get("role", "member"),
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_org_access(user: dict = Depends(get_current_user)) -> str:
    """Ensure user has an org and return org_id."""
    if not user.get("org_id"):
        raise HTTPException(status_code=403, detail="No organization access")
    return user["org_id"]


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Ensure user is an org admin or owner."""
    if user.get("role") not in ("owner", "admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def create_token(user_id: str, email: str, org_id: str, role: str = "member") -> str:
    """Create a JWT token for a user."""
    from datetime import datetime, timedelta
    
    payload = {
        "sub": user_id,
        "email": email,
        "org_id": org_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
