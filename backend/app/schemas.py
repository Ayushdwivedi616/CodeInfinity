from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class AssessmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: int

class AssessmentOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    duration_minutes: int
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True

class TestCaseCreate(BaseModel):
    input_data: str
    expected_output: str
    is_hidden: bool = True
    weight: int = 1

class QuestionCreate(BaseModel):
    assessment_id: int
    title: str
    description: str
    difficulty: str = "medium"
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    constraints: Optional[str] = None
    sample_input: Optional[str] = None
    sample_output: Optional[str] = None
    test_cases: List[TestCaseCreate]

class QuestionOut(BaseModel):
    id: int
    assessment_id: int
    title: str
    description: str
    difficulty: str
    input_format: Optional[str]
    output_format: Optional[str]
    constraints: Optional[str]
    sample_input: Optional[str]
    sample_output: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

class AttemptCreate(BaseModel):
    assessment_id: int

class AttemptOut(BaseModel):
    id: int
    user_id: int
    assessment_id: int
    start_time: datetime
    end_time: Optional[datetime]
    total_score: int

    class Config:
        orm_mode = True

class SubmissionResultOut(BaseModel):
    test_case_id: int
    output_produced: Optional[str]
    passed: bool
    execution_time: float

    class Config:
        orm_mode = True

class SubmissionCreate(BaseModel):
    attempt_id: int
    question_id: int
    code: str
    language: str = "cpp"

class SubmissionOut(BaseModel):
    id: int
    attempt_id: int
    question_id: int
    code: str
    language: str
    submitted_at: datetime
    score: int
    results: List[SubmissionResultOut] = []

    class Config:
        orm_mode = True
