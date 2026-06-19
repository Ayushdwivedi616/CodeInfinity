-- SQL Server schema for Code Infinity Assessment

if object_id('users', 'U') is null
begin
    create table users (
        id int identity(1,1) primary key,
        email varchar(255) not null unique,
        password_hash varchar(255) not null,
        role varchar(50) not null,
        created_at datetime2 not null default sysutcdatetime()
    );
end

if object_id('questions', 'U') is null
begin
    create table questions (
        id int identity(1,1) primary key,
        title varchar(255) not null,
        description varchar(max) not null,
        difficulty varchar(50) not null default 'medium',
        created_at datetime2 not null default sysutcdatetime()
    );
end

if object_id('test_cases', 'U') is null
begin
    create table test_cases (
        id int identity(1,1) primary key,
        question_id int not null,
        input varchar(max) not null,
        expected_output varchar(max) not null,
        is_hidden bit not null default 0,
        constraint fk_test_cases_question foreign key (question_id) references questions(id) on delete cascade
    );
end

if object_id('exams', 'U') is null
begin
    create table exams (
        id int identity(1,1) primary key,
        title varchar(255) not null,
        description varchar(max) null,
        created_at datetime2 not null default sysutcdatetime()
    );
end

if object_id('exam_questions', 'U') is null
begin
    create table exam_questions (
        id int identity(1,1) primary key,
        exam_id int not null,
        question_id int not null,
        constraint fk_exam_questions_exam foreign key (exam_id) references exams(id) on delete cascade,
        constraint fk_exam_questions_question foreign key (question_id) references questions(id) on delete cascade
    );
end

if object_id('submissions', 'U') is null
begin
    create table submissions (
        id int identity(1,1) primary key,
        candidate_id int not null,
        exam_id int null,
        question_id int null,
        code varchar(max) not null,
        language_id int not null default 54,
        score int not null default 0,
        total int not null default 0,
        status varchar(50) not null default 'pending',
        result_details varchar(max) null,
        created_at datetime2 not null default sysutcdatetime(),
        constraint fk_submissions_candidate foreign key (candidate_id) references users(id) on delete cascade,
        constraint fk_submissions_exam foreign key (exam_id) references exams(id) on delete set null,
        constraint fk_submissions_question foreign key (question_id) references questions(id) on delete set null
    );
end
