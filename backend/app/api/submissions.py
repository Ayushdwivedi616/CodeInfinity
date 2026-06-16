from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import SubmissionCreate, SubmissionOut
from ..models import Submission, Question, TestCase, ExamQuestion
from ..auth import require_candidate, require_admin
from ..db import get_db
from ..judge0 import evaluate_submission, run_judge0_submission

router = APIRouter(prefix="/submit", tags=["submissions"])

class CodeRunRequest(BaseModel):
    source_code: str
    language_id: int
    stdin: str = ""

@router.post("/run")
async def run_code(payload: CodeRunRequest, user = Depends(require_candidate)):
    """Execute code immediately without saving submission"""
    result = await run_judge0_submission(
        source_code=payload.source_code,
        stdin=payload.stdin,
        language_id=payload.language_id
    )
    return {
        "status": result.get("status", {}).get("description"),
        "stdout": result.get("stdout", ""),
        "stderr": result.get("stderr", ""),
        "compile_output": result.get("compile_output", ""),
        "exit_code": result.get("exit_code"),
    }

@router.post("/", response_model=SubmissionOut)
async def submit_code(payload: SubmissionCreate, db: AsyncSession = Depends(get_db), user = Depends(require_candidate)):
    question_query = await db.execute(select(Question).where(Question.id == payload.question_id))
    question = question_query.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    test_cases_query = await db.execute(select(TestCase).where(TestCase.question_id == question.id))
    test_cases = test_cases_query.scalars().all()
    score, total, results = await evaluate_submission(payload.source_code, test_cases, payload.language_id)
    submission = Submission(
        candidate_id=user.id,
        exam_id=payload.exam_id,
        question_id=payload.question_id,
        code=payload.source_code,
        language_id=payload.language_id,
        score=score,
        total=total,
        status="completed",
        result_details=str(results),
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission

@router.get("/history", response_model=List[SubmissionOut])
async def submission_history(db: AsyncSession = Depends(get_db), user = Depends(require_candidate)):
    query = await db.execute(select(Submission).where(Submission.candidate_id == user.id).order_by(Submission.created_at.desc()))
    return query.scalars().all()

@router.get("/all", response_model=List[SubmissionOut])
async def all_submissions(db: AsyncSession = Depends(get_db), user = Depends(require_admin)):
    query = await db.execute(select(Submission).order_by(Submission.created_at.desc()))
    return query.scalars().all()
