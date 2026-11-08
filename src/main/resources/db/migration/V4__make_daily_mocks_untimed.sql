-- Daily mocks have no deadline. Store zero as their duration while retaining
-- the measured elapsed time on each attempt (submitted_at - started_at).
ALTER TABLE tests DROP CONSTRAINT chk_tests_counts;
ALTER TABLE tests
    ADD CONSTRAINT chk_tests_counts
    CHECK (
        question_count > 0
        AND total_marks > 0
        AND (
            (test_type = 'GRAND' AND duration_minutes = 180)
            OR (test_type = 'DAILY' AND duration_minutes = 0)
        )
    );
