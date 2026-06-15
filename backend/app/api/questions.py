from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import QuestionCreate, QuestionOut
from ..models import Question, TestCase
from ..auth import require_admin
from ..db import get_db

router = APIRouter(prefix="/questions", tags=["questions"])

@router.post("/", response_model=QuestionOut)
async def create_question(payload: QuestionCreate, db: AsyncSession = Depends(get_db), user = Depends(require_admin)):
    question = Question(title=payload.title, description=payload.description, difficulty=payload.difficulty)
    question.test_cases = [TestCase(input=c.input, expected_output=c.expected_output, is_hidden=c.is_hidden) for c in payload.test_cases]
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question

@router.get("/", response_model=List[QuestionOut])
async def list_questions(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Question))
    return query.scalars().all()

@router.get("/{question_id}", response_model=QuestionOut)
async def get_question(question_id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Question).where(Question.id == question_id))
    question = query.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question
