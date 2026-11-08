-- Assessment templates distinguish the occasional Grand Test from daily mocks.
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(160) NOT NULL,
    test_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    scheduled_date DATE,
    question_count INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tests_type CHECK (test_type IN ('GRAND', 'DAILY')),
    CONSTRAINT chk_tests_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED')),
    CONSTRAINT chk_tests_counts CHECK (question_count > 0 AND duration_minutes > 0 AND total_marks > 0),
    CONSTRAINT chk_daily_date CHECK ((test_type = 'DAILY' AND scheduled_date IS NOT NULL) OR (test_type = 'GRAND' AND scheduled_date IS NULL))
);
CREATE UNIQUE INDEX uk_daily_test_date ON tests(scheduled_date) WHERE test_type = 'DAILY';

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(20) NOT NULL,
    question_text TEXT NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_question_subject CHECK (subject IN ('DCME', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY')),
    CONSTRAINT chk_question_difficulty CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))
);

CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_label CHAR(1) NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chk_option_label CHECK (option_label IN ('A', 'B', 'C', 'D')),
    CONSTRAINT uk_question_option_label UNIQUE (question_id, option_label)
);
CREATE UNIQUE INDEX uk_question_single_correct ON question_options(question_id) WHERE is_correct = TRUE;

CREATE TABLE test_questions (
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    question_order INTEGER NOT NULL,
    marks INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (test_id, question_id),
    CONSTRAINT uk_test_question_order UNIQUE (test_id, question_order)
);

CREATE TABLE test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id),
    student_id UUID NOT NULL REFERENCES users(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    score INTEGER,
    correct_count INTEGER,
    incorrect_count INTEGER,
    unanswered_count INTEGER,
    CONSTRAINT chk_attempt_status CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'TIMED_OUT')),
    CONSTRAINT uk_attempt_per_student UNIQUE (test_id, student_id)
);
CREATE INDEX idx_attempts_student ON test_attempts(student_id, started_at DESC);
CREATE INDEX idx_attempts_test ON test_attempts(test_id);

CREATE TABLE student_answers (
    attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    selected_option_id UUID REFERENCES question_options(id),
    is_correct BOOLEAN,
    marks_awarded INTEGER NOT NULL DEFAULT 0,
    answered_at TIMESTAMPTZ,
    PRIMARY KEY (attempt_id, question_id)
);
