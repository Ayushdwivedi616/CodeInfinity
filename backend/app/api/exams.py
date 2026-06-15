from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import ExamCreate, ExamOut
from ..models import Exam, ExamQuestion, Question
from ..auth import require_admin
from ..db import get_db

router = APIRouter(prefix="/exams", tags=["exams"])

@router.post("/", response_model=ExamOut)
async def create_exam(payload: ExamCreate, db: AsyncSession = Depends(get_db), user = Depends(require_admin)):
    questions = await db.execute(select(Question).where(Question.id.in_(payload.question_ids)))
    records = questions.scalars().all()
    if len(records) != len(payload.question_ids):
        raise HTTPException(status_code=400, detail="One or more questions are invalid")
    exam = Exam(title=payload.title, description=payload.description)
    exam.questions = [ExamQuestion(question_id=qid) for qid in payload.question_ids]
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return exam

@router.get("/", response_model=List[ExamOut])
async def list_exams(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Exam))
    return query.scalars().all()

@router.get("/{exam_id}", response_model=ExamOut)
async def get_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = query.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam
