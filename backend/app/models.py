from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey, func
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "Users"

    id = Column("UserId", Integer, primary_key=True, index=True, autoincrement=True)
    name = Column("Name", String(100), nullable=False)
    email = Column("Email", String(150), unique=True, nullable=False, index=True)
    password_hash = Column("PasswordHash", String(255), nullable=False)
    role = Column("Role", String(20), nullable=False)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.getdate())

    assessments_created = relationship("Assessment", back_populates="created_by_user", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")

class Assessment(Base):
    __tablename__ = "Assessments"

    id = Column("AssessmentId", Integer, primary_key=True, index=True, autoincrement=True)
    title = Column("Title", String(200), nullable=False)
    description = Column("Description", String(500), nullable=True)
    duration_minutes = Column("DurationMinutes", Integer, nullable=False)
    created_by = Column("CreatedBy", Integer, ForeignKey("Users.UserId"), nullable=False)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.getdate())

    created_by_user = relationship("User", back_populates="assessments_created")
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="assessment", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "Questions"

    id = Column("QuestionId", Integer, primary_key=True, index=True, autoincrement=True)
    assessment_id = Column("AssessmentId", Integer, ForeignKey("Assessments.AssessmentId"), nullable=False)
    title = Column("Title", String(200), nullable=False)
    description = Column("Description", Text, nullable=False)
    difficulty = Column("Difficulty", String(50), nullable=False)
    input_format = Column("InputFormat", String(500), nullable=True)
    output_format = Column("OutputFormat", String(500), nullable=True)
    constraints = Column("Constraints", String(500), nullable=True)
    sample_input = Column("SampleInput", Text, nullable=True)
    sample_output = Column("SampleOutput", Text, nullable=True)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.getdate())

    assessment = relationship("Assessment", back_populates="questions")
    test_cases = relationship("TestCase", back_populates="question", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="question", cascade="all, delete-orphan")

class TestCase(Base):
    __tablename__ = "TestCases"

    id = Column("TestCaseId", Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column("QuestionId", Integer, ForeignKey("Questions.QuestionId"), nullable=False)
    input_data = Column("InputData", Text, nullable=False)
    expected_output = Column("ExpectedOutput", Text, nullable=False)
    is_hidden = Column("IsHidden", Boolean, nullable=False, default=True)
    weight = Column("Weight", Integer, nullable=False, default=1)

    question = relationship("Question", back_populates="test_cases")
    results = relationship("SubmissionResult", back_populates="test_case", cascade="all, delete-orphan")

class Attempt(Base):
    __tablename__ = "Attempts"

    id = Column("AttemptId", Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column("UserId", Integer, ForeignKey("Users.UserId"), nullable=False)
    assessment_id = Column("AssessmentId", Integer, ForeignKey("Assessments.AssessmentId"), nullable=False)
    start_time = Column("StartTime", DateTime, nullable=False, default=datetime.utcnow)
    end_time = Column("EndTime", DateTime, nullable=True)
    total_score = Column("TotalScore", Integer, nullable=False, default=0)

    user = relationship("User", back_populates="attempts")
    assessment = relationship("Assessment", back_populates="attempts")
    submissions = relationship("Submission", back_populates="attempt", cascade="all, delete-orphan")

class Submission(Base):
    __tablename__ = "Submissions"

    id = Column("SubmissionId", Integer, primary_key=True, index=True, autoincrement=True)
    attempt_id = Column("AttemptId", Integer, ForeignKey("Attempts.AttemptId"), nullable=False)
    question_id = Column("QuestionId", Integer, ForeignKey("Questions.QuestionId"), nullable=False)
    code = Column("Code", Text, nullable=False)
    language = Column("Language", String(50), nullable=False)
    submitted_at = Column("SubmittedAt", DateTime, nullable=False, server_default=func.getdate())
    score = Column("Score", Integer, nullable=False, default=0)

    attempt = relationship("Attempt", back_populates="submissions")
    question = relationship("Question", back_populates="submissions")
    results = relationship("SubmissionResult", back_populates="submission", cascade="all, delete-orphan")

class SubmissionResult(Base):
    __tablename__ = "SubmissionResults"

    id = Column("ResultId", Integer, primary_key=True, index=True, autoincrement=True)
    submission_id = Column("SubmissionId", Integer, ForeignKey("Submissions.SubmissionId"), nullable=False)
    test_case_id = Column("TestCaseId", Integer, ForeignKey("TestCases.TestCaseId"), nullable=False)
    output_produced = Column("OutputProduced", Text, nullable=True)
    passed = Column("Passed", Boolean, nullable=False)
    execution_time = Column("ExecutionTime", Float, nullable=False, default=0.0)

    submission = relationship("Submission", back_populates="results")
    test_case = relationship("TestCase", back_populates="results")
