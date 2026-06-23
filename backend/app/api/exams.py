from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
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

    question_count = await db.execute(
        select(func.count(Question.id)).where(Question.assessment_id == assessment.id)
    )
    question_count = question_count.scalar_one()

    return AssessmentOut(
        id=assessment.id,
        title=assessment.title,
        description=assessment.description,
        duration_minutes=assessment.duration_minutes,
        created_by=assessment.created_by,
        created_at=assessment.created_at,
        question_count=question_count,
    )

@router.get("", response_model=List[AssessmentOut])
async def list_assessments(db: AsyncSession = Depends(get_db)):
    stmt = select(
        Assessment,
        func.count(Question.id).label('question_count')
    ).outerjoin(Question, Question.assessment_id == Assessment.id).group_by(Assessment.id)
    query = await db.execute(stmt)
    rows = query.all()
    return [
        AssessmentOut(
            id=assessment.id,
            title=assessment.title,
            description=assessment.description,
            duration_minutes=assessment.duration_minutes,
            created_by=assessment.created_by,
            created_at=assessment.created_at,
            question_count=question_count,
        )
        for assessment, question_count in rows
    ]

@router.get("/{assessment_id}", response_model=AssessmentOut)
async def get_assessment(assessment_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(
        Assessment,
        func.count(Question.id).label('question_count')
    ).outerjoin(Question, Question.assessment_id == Assessment.id).where(Assessment.id == assessment_id).group_by(Assessment.id)
    query = await db.execute(stmt)
    row = query.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Assessment not found")
    assessment, question_count = row
    return AssessmentOut(
        id=assessment.id,
        title=assessment.title,
        description=assessment.description,
        duration_minutes=assessment.duration_minutes,
        created_by=assessment.created_by,
        created_at=assessment.created_at,
        question_count=question_count,
    )
