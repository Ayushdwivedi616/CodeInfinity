from __future__ import annotations
import httpx
from .config import settings
from .models import TestCase

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
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()

async def evaluate_submission(source_code: str, test_cases: list[TestCase], language_id: str | int = 54) -> tuple[int, int, list[dict]]:
    language_id = resolve_language_id(language_id)
    score = 0
    total = len(test_cases)
    results = []
    for case in test_cases:
        result = await run_judge0_submission(source_code=source_code, stdin=case.input_data, language_id=language_id)
        output = result.get("stdout") or ""
        normalized_output = output.strip().replace("\r\n", "\n")
        expected = case.expected_output.strip().replace("\r\n", "\n")
        passed = normalized_output == expected
        if passed:
            score += 1
        results.append({
            "input": case.input_data,
            "expected_output": case.expected_output,
            "stdout": output,
            "status": result.get("status", {}).get("description"),
            "passed": passed,
        })
    return score, total, results
