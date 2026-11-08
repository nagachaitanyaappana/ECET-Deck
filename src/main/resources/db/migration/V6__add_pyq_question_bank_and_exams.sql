-- PYQ question bank, randomized student-only attempts, and previous-year paper catalogue.
-- PDFs stay in object storage (e.g. Supabase Storage); PostgreSQL stores metadata and object URLs.
CREATE TABLE pyq_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(20) NOT NULL CHECK (subject IN ('DCME','MATHEMATICS','PHYSICS','CHEMISTRY')),
    topic VARCHAR(160),
    curriculum VARCHAR(20) NOT NULL DEFAULT 'C23',
    question_text TEXT NOT NULL,
    explanation TEXT,
    source_year INTEGER NOT NULL CHECK (source_year BETWEEN 2000 AND 2100),
    source_paper VARCHAR(160) NOT NULL,
    source_question_number INTEGER,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (difficulty IN ('EASY','MEDIUM','HARD')),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pyq_questions_pool ON pyq_questions(subject, curriculum, source_year) WHERE active = TRUE AND verified = TRUE;

CREATE TABLE pyq_question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES pyq_questions(id) ON DELETE CASCADE,
    option_label CHAR(1) NOT NULL CHECK (option_label IN ('A','B','C','D')),
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(question_id, option_label)
);
CREATE UNIQUE INDEX uk_pyq_single_correct ON pyq_question_options(question_id) WHERE is_correct = TRUE;

CREATE TABLE pyq_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(180) NOT NULL,
    exam_year INTEGER NOT NULL CHECK (exam_year BETWEEN 2000 AND 2100),
    branch VARCHAR(40) NOT NULL DEFAULT 'DCME',
    curriculum VARCHAR(20) NOT NULL DEFAULT 'C23',
    paper_type VARCHAR(30) NOT NULL DEFAULT 'QUESTION_PAPER' CHECK (paper_type IN ('QUESTION_PAPER','ANSWER_KEY')),
    storage_path TEXT NOT NULL,
    public_url TEXT,
    source_name VARCHAR(180),
    attribution TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_year, branch, curriculum, paper_type)
);

CREATE TABLE pyq_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id),
    curriculum VARCHAR(20) NOT NULL DEFAULT 'C23',
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS','SUBMITTED','TIMED_OUT')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    score INTEGER,
    correct_count INTEGER,
    incorrect_count INTEGER,
    unanswered_count INTEGER,
    total_questions INTEGER NOT NULL DEFAULT 200 CHECK (total_questions > 0),
    duration_minutes INTEGER NOT NULL DEFAULT 180 CHECK (duration_minutes > 0)
);
CREATE INDEX idx_pyq_attempts_student ON pyq_attempts(student_id, started_at DESC);
CREATE INDEX idx_pyq_attempts_status ON pyq_attempts(status, started_at DESC);

CREATE TABLE pyq_attempt_questions (
    attempt_id UUID NOT NULL REFERENCES pyq_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES pyq_questions(id),
    question_order INTEGER NOT NULL,
    PRIMARY KEY(attempt_id, question_id),
    UNIQUE(attempt_id, question_order)
);
CREATE TABLE pyq_attempt_options (
    attempt_id UUID NOT NULL,
    question_id UUID NOT NULL,
    option_id UUID NOT NULL REFERENCES pyq_question_options(id),
    option_order INTEGER NOT NULL,
    PRIMARY KEY(attempt_id, question_id, option_id),
    UNIQUE(attempt_id, question_id, option_order),
    FOREIGN KEY(attempt_id, question_id) REFERENCES pyq_attempt_questions(attempt_id, question_id) ON DELETE CASCADE
);
CREATE TABLE pyq_student_answers (
    attempt_id UUID NOT NULL,
    question_id UUID NOT NULL,
    selected_option_id UUID,
    is_correct BOOLEAN,
    answered_at TIMESTAMPTZ,
    PRIMARY KEY(attempt_id, question_id),
    FOREIGN KEY(attempt_id, question_id) REFERENCES pyq_attempt_questions(attempt_id, question_id) ON DELETE CASCADE,
    FOREIGN KEY(attempt_id, question_id, selected_option_id)
        REFERENCES pyq_attempt_options(attempt_id, question_id, option_id)
);
