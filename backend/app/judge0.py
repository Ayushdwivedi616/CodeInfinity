from __future__ import annotations
import logging
import httpx
import asyncio
import time
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
    create_url = f"{settings.judge0_base_url}/submissions?base64_encoded=false&wait=false"
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
        logger.info('Creating submission on Judge0', extra={'language_id': language_id})
        resp = await client.post(create_url, json=payload, headers=headers)
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError:
            logger.exception('Judge0 create submission failed')
            raise

        token_payload = resp.json()
        token = token_payload.get('token') or token_payload.get('token_id')
        if not token:
            # If Judge0 returned the full result (wait=true), just return it
            logger.info('Judge0 returned immediate result', extra={'payload_keys': list(token_payload.keys())})
            return token_payload

        get_url = f"{settings.judge0_base_url}/submissions/{token}?base64_encoded=false&fields=stdout,stderr,status_id,status,language_id,compile_output,time"

        deadline = time.time() + 15.0
        while True:
            r = await client.get(get_url, headers=headers)
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError:
                logger.exception('Judge0 fetch result failed')
                raise

            result = r.json()
            # status may be nested under 'status' or present as 'status_id'
            status_obj = result.get('status') or {}
            status_id = status_obj.get('id') if isinstance(status_obj, dict) else None
            if status_id is None:
                status_id = result.get('status_id')

            logger.debug('Polled Judge0 status', extra={'token': token, 'status_id': status_id})

            # status_id: 1 = In Queue, 2 = Processing. Wait until it's no longer in those states.
            if status_id not in (1, 2):
                logger.info('Judge0 final result', extra={'token': token, 'status_id': status_id})
                return result

            if time.time() > deadline:
                logger.warning('Judge0 poll timeout, returning last known result', extra={'token': token})
                return result

            await asyncio.sleep(0.5)

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
        # prefer nested status description if present
        status_desc = None
        if isinstance(result.get('status'), dict):
            status_desc = result['status'].get('description')
        status_desc = status_desc or result.get('status_description') or None

        normalized_output = output.strip().replace("\r\n", "\n")
        expected = (case.expected_output or "").strip().replace("\r\n", "\n")
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
