from __future__ import annotations
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 120
    judge0_base_url: str = "https://ce.judge0.com"
    judge0_token: str | None = None
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
