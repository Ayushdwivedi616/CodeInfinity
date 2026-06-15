-- Supabase / PostgreSQL schema for Code Infinity Assessment

create table if not exists users (
    id serial primary key,
    email text not null unique,
    password_hash text not null,
    role text not null,
    created_at timestamptz default now()
);

create table if not exists questions (
    id serial primary key,
    title text not null,
    description text not null,
    difficulty text not null default 'medium',
    created_at timestamptz default now()
);

create table if not exists test_cases (
    id serial primary key,
    question_id integer not null references questions(id) on delete cascade,
    input text not null,
    expected_output text not null,
    is_hidden boolean not null default false
);

create table if not exists exams (
    id serial primary key,
    title text not null,
    description text,
    created_at timestamptz default now()
);

create table if not exists exam_questions (
    id serial primary key,
    exam_id integer not null references exams(id) on delete cascade,
    question_id integer not null references questions(id) on delete cascade
);

create table if not exists submissions (
    id serial primary key,
    candidate_id integer not null references users(id) on delete cascade,
    exam_id integer references exams(id) on delete set null,
    question_id integer references questions(id) on delete set null,
    code text not null,
    language_id integer not null default 54,
    score integer not null default 0,
    total integer not null default 0,
    status text not null default 'pending',
    result_details text,
    created_at timestamptz default now()
);
