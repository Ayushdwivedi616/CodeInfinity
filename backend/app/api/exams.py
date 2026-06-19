from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import AssessmentCreate, AssessmentOut
from ..models import Assessment, Question
from ..auth import require_admin
from ..db import get_db

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.post("", response_model=AssessmentOut)
async def create_assessment(payload: AssessmentCreate, db: AsyncSession = Depends(get_db), user = Depends(require_admin)):
    assessment = Assessment(
        title=payload.title,
        description=payload.description,
        duration_minutes=payload.duration_minutes,
        created_by=user.id,
    )
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)

    if payload.question_ids:
        query = await db.execute(select(Question).where(Question.id.in_(payload.question_ids)))
        questions = query.scalars().all()
        if len(questions) != len(payload.question_ids):
            raise HTTPException(status_code=404, detail="One or more questions not found")
        for question in questions:
            question.assessment_id = assessment.id
        await db.commit()

    await db.refresh(assessment)
    return assessment

@router.get("", response_model=List[AssessmentOut])
async def list_assessments(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Assessment))
    return query.scalars().all()

@router.get("/{assessment_id}", response_model=AssessmentOut)
async def get_assessment(assessment_id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    assessment = query.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment
