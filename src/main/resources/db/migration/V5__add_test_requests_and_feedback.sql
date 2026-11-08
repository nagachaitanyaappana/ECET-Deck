-- Grand test requests submitted by students when ready for 200-question full exam
CREATE TABLE grand_test_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    note TEXT,
    generated_test_id UUID REFERENCES tests(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    CONSTRAINT chk_request_status CHECK (status IN ('PENDING', 'FULFILLED', 'DISMISSED'))
);

CREATE INDEX idx_grand_test_requests_student ON grand_test_requests(student_id);
CREATE INDEX idx_grand_test_requests_status ON grand_test_requests(status);

-- Student suggestions, bug reports, and question error feedback
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    category VARCHAR(30) NOT NULL DEFAULT 'GENERAL',
    subject VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT chk_feedback_status CHECK (status IN ('OPEN', 'REVIEWED', 'RESOLVED'))
);

CREATE INDEX idx_feedbacks_user ON feedbacks(user_id);
CREATE INDEX idx_feedbacks_status ON feedbacks(status);
