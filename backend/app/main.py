from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth as auth_router
from .api import questions as questions_router
from .api import exams as exams_router
from .api import submissions as submissions_router
from .api import attempts as attempts_router
from .db import engine
from .models import Base

app = FastAPI(title="Code Infinity Assessment", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(questions_router.router)
app.include_router(exams_router.router)
app.include_router(submissions_router.router)
app.include_router(attempts_router.router)

@app.on_event("startup")
async def startup_event() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def health_check() -> dict:
    return {"status": "ok", "service": "Code Infinity Assessment"}
