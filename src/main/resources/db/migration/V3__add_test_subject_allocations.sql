-- Persist the exact per-subject question allocation used by each assessment.
CREATE TABLE test_subject_allocations (
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    subject VARCHAR(20) NOT NULL,
    question_count INTEGER NOT NULL,
    PRIMARY KEY (test_id, subject),
    CONSTRAINT chk_allocation_subject CHECK (subject IN ('DCME', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY')),
    CONSTRAINT chk_allocation_count CHECK (question_count > 0)
);

ALTER TABLE tests
    ADD CONSTRAINT chk_grand_test_configuration
        CHECK (test_type <> 'GRAND' OR (question_count = 200 AND duration_minutes = 180 AND total_marks = 200)),
    ADD CONSTRAINT chk_daily_test_configuration
        CHECK (test_type <> 'DAILY' OR (question_count = 50 AND total_marks = 50));
