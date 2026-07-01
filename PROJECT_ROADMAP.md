# Code Infinity Roadmap

## Overview

Code Infinity is a full-stack coding assessment platform built as a HackerRank-style experience with:
- `FastAPI` backend for authentication, exam management, submissions, and Judge0 execution
- `React + Vite + Tailwind` frontend for admin and candidate workflows
- `Microsoft SQL Server` database for users, assessments, questions, test cases, attempts, and results

## Current Implementation

### Backend

- `backend/app/main.py` — FastAPI application entrypoint with CORS and routers configured
- `backend/app/config.py` — environment configuration loader for database and auth settings
- `backend/app/db.py` — async SQLAlchemy session and engine creation for `mssql+aioodbc`
- `backend/app/models.py` — SQLAlchemy ORM models for users, exams, questions, submissions, and results
- `backend/app/schemas.py` — Pydantic request/response schemas
- `backend/app/api/` — API routers for authentication, exams, questions, attempts, and submissions
- `backend/schema.sql` — SQL Server schema definitions used by the app

### Frontend

- `frontend/src/App.tsx` — application routes and page navigation
- `frontend/src/pages/` — pages for AdminDashboard, CandidateExams, ExamBuilder, ExamRoom, History, LandingPage, Login, QuestionBuilder, and Submissions
- `frontend/src/components/` — reusable UI cards and panels
- `frontend/src/lib/api.ts` — Axios client and API wrappers
- `frontend/vite.config.ts` — development proxy for backend API requests

## Key Features Implemented

- JWT authentication with admin and candidate access
- Admin exam and question creation workflows
- Candidate exam selection, code submission, and history view
- Judge0 integration for code execution and scoring
- Submission review endpoints for admin evaluation
- Backend CORS and frontend proxy support for local development

## Known Gaps and Issues

- Exam lifecycle is still basic: no formal exam start/stop timers or access control by assignment
- Candidate UI currently has limited exam progress and scoring details
- Admin review currently returns submission data but needs richer result presentation
- Security hardening is needed for production: role-based API enforcement, input sanitization, and Judge0 sandboxing
- Missing production deployment path and environment-specific configuration

## Short-Term Roadmap

1. Stabilize backend API and fix existing edge cases
   - Ensure all protected routes validate roles correctly
   - Add better error handling for submission results and Judge0 failures
   - Expand database queries to include eager loading for joined relations

2. Improve candidate exam workflow
   - Add assigned exams and exam availability windows
   - Add timer and progress state inside `ExamRoom`
   - Show live scoring and test case feedback after submission

3. Improve admin tooling
   - Add question bank management and exam question selection UI
   - Add submission filtering, sorting, and detailed result inspection
   - Add ability to approve/reject or comment on candidate submissions

4. UX and platform polish
   - Add form validation, success/error notifications, and loading states
   - Add a dashboard summary for admin and candidate usage
   - Add responsive/mobile improvements for exam screens

## Mid-Term Roadmap

- Add exam assignment to candidates and role-based exam access
- Add analytics for performance, success rates, and question difficulty
- Add support for more languages and a richer code editor experience
- Add candidate onboarding, password reset, and profile management
- Add continuous integration and automated deployment scripts

## Recommended Next Steps

- Recreate missing documentation like this roadmap and maintain it alongside the code
- Add a `docs/` folder for architecture diagrams, API reference, and endpoint usage
- Add tests for backend routers and frontend API integration
- Align environment configuration with a `.env.example` and README setup steps

## File Locations

- Root: `PROJECT_ROADMAP.md`
- Backend entry: `backend/app/main.py`
- Frontend entry: `frontend/src/main.tsx`
- Database schema: `backend/schema.sql`

---

> This roadmap is meant to guide the next development cycle and keep the platform aligned with a HackerRank-style assessment product.
