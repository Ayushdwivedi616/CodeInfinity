# Code Infinity Assessment Platform

A full-stack coding assessment platform built with React + Tailwind, FastAPI, PostgreSQL (Supabase), and Judge0.

## Project structure

- `backend/`: FastAPI service, JWT auth, Supabase Postgres schema, Judge0 execution integration
- `frontend/`: React + Tailwind premium SaaS UI with admin and candidate workflows
- `Public/`: existing workspace asset folder

## Key features

- Landing page with split admin/candidate login cards
- Admin flows for question creation, exam creation, and submission review
- Candidate experience for exam selection, live coding, and history
- Judge0 integration for secure C++ execution and hidden test evaluation
- Supabase/Postgres schema for users, questions, test cases, exams, exam questions, and submissions

## Setup

1. Backend
   - Create a Python 3.11+ virtual environment
   - Install dependencies: `python -m pip install -r backend/requirements.txt` or `python -m pip install fastapi uvicorn[standard] python-jose[cryptography] passlib[bcrypt] sqlalchemy[asyncio] asyncpg httpx python-dotenv pydantic`
   - Copy `backend/.env.example` to `backend/.env` and update credentials
   - Run backend: `cd backend && uvicorn app.main:app --reload`

2. Frontend
   - Install dependencies: `cd frontend && npm install`
   - Start UI: `npm run dev`

3. Database
   - Use Supabase or Postgres with the connection string defined in `backend/.env`
   - Ensure `DATABASE_URL` uses `postgresql+asyncpg://...`

## Supabase schema

See `backend/schema.sql` for the database migrations and table definitions.
