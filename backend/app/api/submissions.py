from typing import List
from datetime import datetime
import logging
import traceback
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import SubmissionCreate, SubmissionOut, SubmissionResultOut
from ..models import Submission, Question, TestCase, Attempt, SubmissionResult
from ..auth import require_candidate, require_admin
from ..db import get_db
from ..judge0 import evaluate_submission, run_judge0_submission, resolve_language_id

logger = logging.getLogger('submissions_api')
router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/run")
async def run_code(payload: dict):
    stdin = payload.get("stdin", "")
    source_code = payload.get("source_code", "")
    language = payload.get("language", "cpp")
    language_id = resolve_language_id(language)
    logger.info('Run code request', extra={'language': language, 'language_id': language_id})

    try:
        result = await run_judge0_submission(source_code=source_code, stdin=stdin, language_id=language_id)
        # status may be a dict ({id, description}) or a scalar/status_id may be present
        status_obj = result.get("status")
        status_desc = ""
        status_id = None
        if isinstance(status_obj, dict):
            status_desc = status_obj.get("description", "")
            status_id = status_obj.get("id")
        else:
            # some responses include status_id separately
            status_desc = result.get("status") or result.get("status_description") or ""
            status_id = result.get("status_id")

        # map compile_output: prefer explicit compile_output, otherwise use stderr for compile errors,
        # otherwise fall back to stdout so UI shows the program output when appropriate
        compile_output_val = result.get("compile_output")
        if not compile_output_val:
            # if status indicates compilation error, prefer stderr
            status_lower = (status_desc or "").lower()
            if "compil" in status_lower or "compile" in status_lower:
                compile_output_val = result.get("stderr") or ""
            else:
                compile_output_val = result.get("stdout") or ""

        output_val = result.get("stdout") or ""
        return {
            "stdout": "",
            "stderr": result.get("stderr") or "",
            "compile_output": compile_output_val or output_val,
            "language": language,
            "source_code": source_code,
            "status": status_desc,
            "success": (status_desc or "").lower() == "accepted",
            "debug": {
                "requested_language": language,
                "resolved_language_id": language_id,
                "judge0_status_id": status_id,
                "judge0_status": status_desc,
                "token_used": bool(result.get("token")),
            },
        }
    except Exception as exc:
        logger.error('Run code failed', exc_info=True, extra={'language': language})
        return {
            "stdout": "",
            "stderr": "",
            "compile_output": "",
            "language": language,
            "source_code": source_code,
            "status": "error",
            "error": str(exc),
            "debug": traceback.format_exc(),
        }

@router.post("", response_model=SubmissionOut)
async def submit_code(payload: SubmissionCreate, db: AsyncSession = Depends(get_db), user = Depends(require_candidate)):
    attempt_query = await db.execute(select(Attempt).where(Attempt.id == payload.attempt_id))
    attempt = attempt_query.scalar_one_or_none()
    if not attempt or attempt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Attempt not found")

    question_query = await db.execute(select(Question).where(Question.id == payload.question_id))
    question = question_query.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    test_cases_query = await db.execute(select(TestCase).where(TestCase.question_id == question.id))
    test_cases = test_cases_query.scalars().all()

    score, total, results = await evaluate_submission(payload.code, test_cases, payload.language)

    submission = Submission(
        attempt_id=payload.attempt_id,
        question_id=payload.question_id,
        code=payload.code,
        language=payload.language,
        submitted_at=datetime.utcnow(),
        score=score,
    )

    db.add(submission)
    await db.commit()
    await db.refresh(submission)

    submission.results = [
        SubmissionResult(
            submission_id=submission.id,
            test_case_id=r["test_case_id"],
            output_produced=r.get("stdout", r.get("output", "")),
            passed=r["passed"],
            execution_time=r.get("execution_time", 0.0),
        )
        for r in results
    ]
    await db.commit()
    await db.refresh(submission)
    return SubmissionOut(
        id=submission.id,
        attempt_id=submission.attempt_id,
        question_id=submission.question_id,
        code=submission.code,
        language=submission.language,
        submitted_at=submission.submitted_at,
        score=submission.score,
        results=[SubmissionResultOut(
            test_case_id=result.test_case_id,
            output_produced=result.output_produced,
            passed=result.passed,
            execution_time=result.execution_time,
        ) for result in submission.results],
    )

@router.get("/history", response_model=List[SubmissionOut])
async def submission_history(db: AsyncSession = Depends(get_db), user = Depends(require_candidate)):
    query = await db.execute(
        select(Submission).join(Attempt).where(Attempt.user_id == user.id)
    )
    submissions = query.scalars().all()
    return [
        SubmissionOut(
            id=sub.id,
            attempt_id=sub.attempt_id,
            question_id=sub.question_id,
            code=sub.code,
            language=sub.language,
            submitted_at=sub.submitted_at,
            score=sub.score,
            results=[
                SubmissionResultOut(
                    test_case_id=res.test_case_id,
                    output_produced=res.output_produced,
                    passed=res.passed,
                    execution_time=res.execution_time,
                ) for res in sub.results
            ],
        )
        for sub in submissions
    ]

@router.get("/all", response_model=List[SubmissionOut])
async def all_submissions(db: AsyncSession = Depends(get_db), user = Depends(require_admin)):
    query = await db.execute(select(Submission).order_by(Submission.submitted_at.desc()))
    submissions = query.scalars().all()
    return [
        SubmissionOut(
            id=sub.id,
            attempt_id=sub.attempt_id,
            question_id=sub.question_id,
            code=sub.code,
            language=sub.language,
            submitted_at=sub.submitted_at,
            score=sub.score,
            results=[
                SubmissionResultOut(
                    test_case_id=res.test_case_id,
                    output_produced=res.output_produced,
                    passed=res.passed,
                    execution_time=res.execution_time,
                ) for res in sub.results
            ],
        )
        for sub in submissions
    ]
