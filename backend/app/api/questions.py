from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import QuestionCreate, QuestionOut
from ..models import Question, TestCase, Assessment
from ..auth import require_admin
from ..db import get_db

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/", response_model=QuestionOut)
async def create_question(payload: QuestionCreate, db: AsyncSession = Depends(get_db), user = Depends(require_admin)):
    assessment_query = await db.execute(select(Assessment).where(Assessment.id == payload.assessment_id))
    assessment = assessment_query.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    question = Question(
        assessment_id=payload.assessment_id,
        title=payload.title,
        description=payload.description,
        difficulty=payload.difficulty,
        input_format=payload.input_format,
        output_format=payload.output_format,
        constraints=payload.constraints,
        sample_input=payload.sample_input,
        sample_output=payload.sample_output,
    )

    question.test_cases = [
        TestCase(
            input_data=c.input_data,
            expected_output=c.expected_output,
            is_hidden=c.is_hidden,
            weight=c.weight,
        )
        for c in payload.test_cases
    ]

    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question

@router.get("/", response_model=List[QuestionOut])
async def list_questions(assessment_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Question)
    if assessment_id is not None:
        stmt = stmt.where(Question.assessment_id == assessment_id)
    query = await db.execute(stmt)
    return query.scalars().all()

@router.get("/{question_id}", response_model=QuestionOut)
async def get_question(question_id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Question).where(Question.id == question_id))
    question = query.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question
