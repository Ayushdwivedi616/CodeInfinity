from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserBase(BaseModel):
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class TestCaseCreate(BaseModel):
    input: str
    expected_output: str
    is_hidden: bool = False

class QuestionCreate(BaseModel):
    title: str
    description: str
    difficulty: str = "medium"
    test_cases: List[TestCaseCreate]

class QuestionOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    class Config:
        orm_mode = True

class ExamCreate(BaseModel):
    title: str
    description: Optional[str] = None
    question_ids: List[int]

class ExamOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    class Config:
        orm_mode = True

class SubmissionCreate(BaseModel):
    exam_id: int
    question_id: int
    source_code: str
    language_id: int = 54

class SubmissionOut(BaseModel):
    id: int
    candidate_id: int
    exam_id: Optional[int]
    question_id: Optional[int]
    score: int
    total: int
    status: str
    result_details: Optional[str]
    created_at: datetime
    class Config:
        orm_mode = True
