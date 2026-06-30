from __future__ import annotations

import asyncio
import logging
import os
import subprocess
import tempfile
from pathlib import Path
from typing import Any

logger = logging.getLogger("code_runner.docker")

LANGUAGE_CONFIG = {
    "cpp": {
        "image": "gcc:13",
        "source_name": "main.cpp",
        "compile_command": "g++ -std=c++17 -O2 -o main main.cpp",
        "run_command": "timeout 2s ./main",
    },
    "python": {
        "image": "python:3.11-slim",
        "source_name": "main.py",
        "compile_command": None,
        "run_command": "timeout 2s python main.py",
    },
    "java": {
        "image": "eclipse-temurin:17-jdk",
        "source_name": "Main.java",
        "compile_command": "javac Main.java",
        "run_command": "timeout 2s java Main",
    },
}


def _to_docker_mount_path(path: str) -> str:
    if os.name == "nt":
        normalized = path.replace("\\", "/")
        if len(normalized) >= 2 and normalized[1] == ":":
            return f"/{normalized[0].lower()}{normalized[2:]}"
        return normalized
    return path


def _build_docker_command(image: str, mount_path: str, command: str) -> list[str]:
    return [
        "docker",
        "run",
        "--rm",
        "--network",
        "none",
        "--memory",
        "128m",
        "--cpus",
        "0.5",
        "-v",
        f"{mount_path}:/app",
        "--workdir",
        "/app",
        image,
        "sh",
        "-lc",
        command,
    ]


async def execute_with_docker(source_code: str, stdin: str, language: str) -> dict[str, Any]:
    config = LANGUAGE_CONFIG.get(language.lower(), LANGUAGE_CONFIG["cpp"])
    with tempfile.TemporaryDirectory(prefix="sandbox-", dir=tempfile.gettempdir()) as temp_dir:
        temp_path = Path(temp_dir)
        source_path = temp_path / config["source_name"]
        source_path.write_text(source_code or "", encoding="utf-8")
        input_path = temp_path / "input.txt"
        input_path.write_text(stdin or "", encoding="utf-8")

        mount_path = _to_docker_mount_path(str(temp_path))

        compile_output = ""
        if config["compile_command"]:
            compile_command = f"{config['compile_command']} 2> compile.err"
            try:
                await asyncio.to_thread(
                    _run_process,
                    _build_docker_command(config["image"], mount_path, compile_command),
                    timeout=20,
                )
            except subprocess.CalledProcessError as exc:
                compile_output = _read_file(temp_path / "compile.err")
                if not compile_output:
                    compile_output = (exc.stderr or "").strip() or (exc.stdout or "").strip()
                return {
                    "stdout": "",
                    "stderr": compile_output,
                    "compile_output": compile_output,
                    "status": "Compilation Error",
                    "exit_code": exc.returncode,
                }
            except subprocess.TimeoutExpired:
                return {
                    "stdout": "",
                    "stderr": "",
                    "compile_output": "Compilation timed out",
                    "status": "Compilation Error",
                    "exit_code": 124,
                }

        try:
            run_command = f"{config['run_command']} < input.txt"
            completed = await asyncio.to_thread(
                _run_process,
                _build_docker_command(config["image"], mount_path, run_command),
                timeout=20,
            )
        except subprocess.TimeoutExpired:
            return {
                "stdout": "",
                "stderr": "",
                "compile_output": compile_output,
                "status": "Time Limit Exceeded",
                "exit_code": 124,
            }
        except subprocess.CalledProcessError as exc:
            stderr_text = (exc.stderr or "").strip()
            stdout_text = (exc.stdout or "").strip()
            if exc.returncode == 137:
                status = "Memory Limit Exceeded"
            else:
                status = "Runtime Error"
            return {
                "stdout": stdout_text,
                "stderr": stderr_text,
                "compile_output": compile_output,
                "status": status,
                "exit_code": exc.returncode,
            }

        return {
            "stdout": completed.stdout.strip(),
            "stderr": completed.stderr.strip(),
            "compile_output": compile_output,
            "status": "Accepted",
            "exit_code": completed.returncode,
        }


def _read_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace").strip()
    except FileNotFoundError:
        return ""


def _run_process(command: list[str], timeout: int) -> subprocess.CompletedProcess[str]:
    try:
        completed = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding="utf-8",
            errors="replace",
        )
    except FileNotFoundError as exc:
        logger.exception("Docker CLI not available")
        raise RuntimeError("Docker is not available on this host") from exc
    except subprocess.TimeoutExpired as exc:
        logger.warning("Docker execution timed out", extra={"timeout": timeout})
        raise

    if completed.returncode not in {0, 124}:
        raise subprocess.CalledProcessError(
            completed.returncode,
            command,
            output=completed.stdout,
            stderr=completed.stderr,
        )

    return completed
