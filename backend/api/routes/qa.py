"""QA routes — wired to Supabase."""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

from db import get_client
from auth import get_current_user

router = APIRouter()


class ReviewSubmit(BaseModel):
    scores: dict
    flags: list = []
    comments: str = ""
    decision: str  # approve, reject, request_revision


@router.get("/queue")
async def review_queue(
    review_type: Optional[str] = None,
    limit: int = Query(20, le=100),
    user: dict = Depends(get_current_user),
):
    db = get_client(use_admin=True)
    query = db.table("qa_reviews").select("*, tasks(title, task_type, tier, priority)").eq("org_id", user["org_id"]).eq("passed", False)
    
    if review_type:
        query = query.eq("review_type", review_type)
    
    result = query.order("created_at", desc=False).limit(limit).execute()
    return {"queue": result.data, "total": len(result.data)}


@router.get("/{review_id}")
async def get_review(review_id: str, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    result = db.table("qa_reviews").select("*, tasks(*)").eq("id", review_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")
    return result.data[0]


@router.post("/{review_id}/approve")
async def approve_review(review_id: str, user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    
    review = db.table("qa_reviews").select("task_id").eq("id", review_id).execute()
    if not review.data:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.table("qa_reviews").update({"passed": True, "reviewer": user["id"]}).eq("id", review_id).execute()
    db.table("tasks").update({"status": "approved", "updated_at": datetime.utcnow().isoformat()}).eq("id", review.data[0]["task_id"]).execute()
    
    return {"id": review_id, "status": "approved"}


@router.post("/{review_id}/reject")
async def reject_review(review_id: str, reason: str = "", user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    
    review = db.table("qa_reviews").select("task_id").eq("id", review_id).execute()
    if not review.data:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.table("qa_reviews").update({"passed": False, "comments": reason, "reviewer": user["id"]}).eq("id", review_id).execute()
    db.table("tasks").update({"status": "revision", "updated_at": datetime.utcnow().isoformat()}).eq("id", review.data[0]["task_id"]).execute()
    
    return {"id": review_id, "status": "rejected", "reason": reason}


@router.get("/rubrics")
async def list_rubrics(user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    result = db.table("rubrics").select("*").eq("is_active", True).execute()
    return {"rubrics": result.data}


@router.get("/stats")
async def qa_stats(user: dict = Depends(get_current_user)):
    db = get_client(use_admin=True)
    reviews = db.table("qa_reviews").select("review_type, passed, score_overall").eq("org_id", user["org_id"]).execute().data or []
    
    total = len(reviews)
    passed = len([r for r in reviews if r["passed"]])
    automated = len([r for r in reviews if r["review_type"] == "automated"])
    auto_passed = len([r for r in reviews if r["review_type"] == "automated" and r["passed"]])
    
    return {
        "total_reviewed": total,
        "pass_rate": round(passed / max(total, 1) * 100, 1),
        "avg_score": round(sum(r.get("score_overall", 0) or 0 for r in reviews) / max(total, 1), 1),
        "automated_pass_rate": round(auto_passed / max(automated, 1) * 100, 1),
    }
