-- Register the two AP ECET CSE papers supplied for the C23 DCME paper library.
-- The PDF files remain in Google Drive; only their IDs and share URLs are stored here.
INSERT INTO pyq_papers
    (title, exam_year, branch, curriculum, paper_type, storage_path, public_url, source_name)
VALUES
    ('AP ECET 2025 CSE Question Paper', 2025, 'DCME', 'C23', 'QUESTION_PAPER',
     'google-drive:1yqxeVh9gzp3aH62843AYWjrN7jGX_zO1',
     'https://drive.google.com/file/d/1yqxeVh9gzp3aH62843AYWjrN7jGX_zO1/view',
     'Google Drive'),
    ('AP ECET 2026 CSE Question Paper', 2026, 'DCME', 'C23', 'QUESTION_PAPER',
     'google-drive:1PH44N21MLP4Q4XP4q6YPZ3eW6xaMowxg',
     'https://drive.google.com/file/d/1PH44N21MLP4Q4XP4q6YPZ3eW6xaMowxg/view',
     'Google Drive')
ON CONFLICT (exam_year, branch, curriculum, paper_type) DO NOTHING;
