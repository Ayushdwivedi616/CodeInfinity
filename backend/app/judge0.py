from __future__ import annotations
import logging
from .models import TestCase
from .services.code_runner import run_sandboxed_submission

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger('code_runner')

LANGUAGE_MAP = {
    "cpp": 54,
    "python": 71,
    "java": 62,
    "javascript": 63,
}

def resolve_language_id(language: str | int = 54) -> int:
    if isinstance(language, int):
        return language
    return LANGUAGE_MAP.get(language.lower(), 54)

async def run_judge0_submission(source_code: str, stdin: str, language_id: str | int = 54) -> dict:
    language_id = resolve_language_id(language_id)
    logger.info('Sending submission to local Docker sandbox', extra={'language_id': language_id, 'stdin': stdin})
    try:
        result = await run_sandboxed_submission(source_code=source_code, stdin=stdin, language_id=language_id)
        logger.info('Sandbox execution completed', extra={'status': result.get('status'), 'stderr': bool(result.get('stderr')), 'compile_output': bool(result.get('compile_output'))})
        return result
    except Exception as exc:
        logger.exception('Sandbox execution failed')
        return {
            "stdout": "",
            "stderr": str(exc),
            "compile_output": "",
            "status": "Runtime Error",
            "exit_code": 1,
        }

async def evaluate_submission(source_code: str, test_cases: list[TestCase], language_id: str | int = 54) -> tuple[int, int, list[dict]]:
    language_id = resolve_language_id(language_id)
    score = 0
    total = len(test_cases)
    results = []
    for case in test_cases:
        result = await run_judge0_submission(source_code=source_code, stdin=case.input_data, language_id=language_id)
        output = result.get("stdout") or ""
        stderr = result.get("stderr") or ""
        compile_output = result.get("compile_output") or ""
        status_desc = result.get("status")

        normalized_output = output.strip().replace("\r\n", "\n")
        expected = case.expected_output.strip().replace("\r\n", "\n")
        passed = normalized_output == expected
        status_desc = result.get("status")
        if status_desc == "Accepted" and not passed:
            status_desc = "Wrong Answer"
        if status_desc == "Accepted" and passed:
            score += 1

        logger.debug('Sandbox test result', extra={
            'input': case.input_data,
            'expected_output': case.expected_output,
            'stdout': output,
            'stderr': stderr,
            'compile_output': compile_output,
            'status': status_desc,
            'passed': passed,
        })

        results.append({
            "test_case_id": case.id,
            "input": case.input_data,
            "expected_output": case.expected_output,
            "stdout": output,
            "output": output,
            "stderr": stderr,
            "compile_output": compile_output,
            "status": status_desc,
            "execution_time": 0.0,
            "passed": passed,
        })
        if not passed:
            break
    return score, total, results
