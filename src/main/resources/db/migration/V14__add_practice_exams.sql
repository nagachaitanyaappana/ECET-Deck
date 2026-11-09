-- Migration V14: Subject-Wise & Topic-Wise Practice Exams
-- Allows students to practice specific subjects, single topics, or multi-topic drills with instant grading and explanations.

CREATE TABLE practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(20) NOT NULL CHECK (subject IN ('DCME','MATHEMATICS','PHYSICS','CHEMISTRY')),
    mode VARCHAR(30) NOT NULL DEFAULT 'TOPIC' CHECK (mode IN ('SUBJECT','TOPIC','MULTI_TOPIC')),
    selected_topics TEXT,
    total_questions INTEGER NOT NULL CHECK (total_questions > 0),
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS','SUBMITTED','TIMED_OUT')),
    score INTEGER,
    correct_count INTEGER,
    incorrect_count INTEGER,
    unanswered_count INTEGER,
    accuracy DOUBLE PRECISION,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ
);
CREATE INDEX idx_practice_attempts_student ON practice_attempts(student_id, started_at DESC);

CREATE TABLE practice_attempt_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES practice_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL,
    question_order INTEGER NOT NULL,
    subject VARCHAR(20) NOT NULL,
    topic VARCHAR(160),
    question_text TEXT NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(20),
    selected_option_id UUID,
    is_correct BOOLEAN
);
CREATE INDEX idx_practice_q_attempt ON practice_attempt_questions(attempt_id, question_order);

CREATE TABLE practice_attempt_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_question_id UUID NOT NULL REFERENCES practice_attempt_questions(id) ON DELETE CASCADE,
    option_label CHAR(1) NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_practice_opt_q ON practice_attempt_options(attempt_question_id);
