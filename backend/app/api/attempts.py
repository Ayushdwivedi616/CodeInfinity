from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import AttemptCreate, AttemptOut
from ..models import Attempt, Assessment
from ..auth import require_candidate
from ..db import get_db

router = APIRouter(prefix="/attempts", tags=["attempts"])

@router.post("", response_model=AttemptOut)
async def create_attempt(payload: AttemptCreate, db: AsyncSession = Depends(get_db), user = Depends(require_candidate)):
    assessment_query = await db.execute(select(Assessment).where(Assessment.id == payload.assessment_id))
    assessment = assessment_query.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    attempt = Attempt(user_id=user.id, assessment_id=payload.assessment_id, start_time=datetime.utcnow())
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    return attempt

@router.get("", response_model=List[AttemptOut])
async def list_attempts(db: AsyncSession = Depends(get_db), user = Depends(require_candidate)):
    query = await db.execute(select(Attempt).where(Attempt.user_id == user.id).order_by(Attempt.start_time.desc()))
    return query.scalars().all()
