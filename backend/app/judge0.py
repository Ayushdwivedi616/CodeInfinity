from __future__ import annotations
import logging
import httpx
from .config import settings
from .models import TestCase

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
    url = f"{settings.judge0_base_url}/submissions?base64_encoded=false&wait=true"
    headers = {"Content-Type": "application/json"}
    if settings.judge0_token:
        headers["X-Auth-Token"] = settings.judge0_token
    payload = {
        "source_code": source_code,
        "stdin": stdin,
        "language_id": language_id,
        "cpu_time_limit": 2,
        "memory_limit": 128000,
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        logger.info('Sending submission to Judge0', extra={'language_id': language_id, 'stdin': stdin})
        response = await client.post(url, json=payload, headers=headers)
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            logger.exception('Judge0 request failed with HTTP error')
            raise

        result = response.json()
        logger.info('Judge0 response received', extra={'status': result.get('status', {}), 'stderr': bool(result.get('stderr')), 'compile_output': bool(result.get('compile_output'))})
        return result

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
        status_desc = result.get("status", {}).get("description")

        normalized_output = output.strip().replace("\r\n", "\n")
        expected = case.expected_output.strip().replace("\r\n", "\n")
        passed = normalized_output == expected
        if passed:
            score += 1

        logger.debug('Judge0 test result', extra={
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
            "execution_time": float(result.get("time") or result.get("cpu_time") or 0.0),
            "passed": passed,
        })
    return score, total, results
