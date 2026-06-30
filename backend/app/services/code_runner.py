from __future__ import annotations

import logging
from typing import Any

from .docker_runner import execute_with_docker

logger = logging.getLogger("code_runner")

LANGUAGE_ID_MAP = {
    54: "cpp",
    62: "java",
    71: "python",
}


def resolve_language_name(language: str | int = 54) -> str:
    if isinstance(language, int):
        return LANGUAGE_ID_MAP.get(language, "cpp")
    if isinstance(language, str):
        normalized = language.lower()
        if normalized in {"cpp", "c++", "c", "cxx"}:
            return "cpp"
        if normalized in {"java", "javac"}:
            return "java"
        if normalized in {"python", "py", "python3"}:
            return "python"
    return "cpp"


async def run_sandboxed_submission(source_code: str, stdin: str, language_id: str | int = 54) -> dict[str, Any]:
    language_name = resolve_language_name(language_id)
    logger.info("Starting sandboxed execution", extra={"language": language_name})
    return await execute_with_docker(source_code=source_code, stdin=stdin, language=language_name)
