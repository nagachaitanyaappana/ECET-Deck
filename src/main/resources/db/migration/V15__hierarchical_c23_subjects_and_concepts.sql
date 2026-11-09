-- Migration V15: Hierarchical C-23 Subjects and Concepts for AP ECET 2027
-- Adds concept-level granularity to question bank and practice attempts.

-- 1. Extend pyq_questions with concept
ALTER TABLE pyq_questions ADD COLUMN IF NOT EXISTS concept VARCHAR(160);
CREATE INDEX IF NOT EXISTS idx_pyq_concept ON pyq_questions(topic, concept) WHERE active = TRUE AND verified = TRUE;

-- 2. Relax practice_attempts constraints to support DCME technical subjects and concept modes
ALTER TABLE practice_attempts DROP CONSTRAINT IF EXISTS practice_attempts_subject_check;
ALTER TABLE practice_attempts ALTER COLUMN subject TYPE VARCHAR(100);
ALTER TABLE practice_attempts DROP CONSTRAINT IF EXISTS practice_attempts_mode_check;
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_mode_check CHECK (mode IN ('SUBJECT','CONCEPT','MULTI_CONCEPT','TOPIC','MULTI_TOPIC'));
ALTER TABLE practice_attempts ADD COLUMN IF NOT EXISTS selected_concepts TEXT;

-- 3. Extend practice_attempt_questions with concept and flexible subject name
ALTER TABLE practice_attempt_questions ALTER COLUMN subject TYPE VARCHAR(100);
ALTER TABLE practice_attempt_questions ADD COLUMN IF NOT EXISTS concept VARCHAR(160);

-- 4. Normalize existing DCME pyq_questions with their default primary concept unit
UPDATE pyq_questions SET concept = 'Process Management & CPU Scheduling' WHERE subject = 'DCME' AND (topic ILIKE '%Operating System%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'Concepts of DBMS, RDBMS & ER Modeling' WHERE subject = 'DCME' AND (topic ILIKE '%Database%' OR topic ILIKE '%DBMS%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'Introduction to Networks & Reference Models' WHERE subject = 'DCME' AND (topic ILIKE '%Network%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'Linear Data Structures - Stacks & Queues' WHERE subject = 'DCME' AND (topic ILIKE '%Data Structure%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'OOP Concepts, Basics of Java & Overloading' WHERE subject = 'DCME' AND (topic ILIKE '%Java%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'Logic Gates, Boolean Algebra & Basic Combinational Circuits' WHERE subject = 'DCME' AND (topic ILIKE '%Digital Electronic%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'Introduction to C & Fundamentals' WHERE subject = 'DCME' AND (topic ILIKE '%C Programming%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'Basics of Software Engineering & Life Cycle Models' WHERE subject = 'DCME' AND (topic ILIKE '%Software Eng%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = '8086 Microprocessor Architecture & Assembly' WHERE subject = 'DCME' AND (topic ILIKE '%Microprocessor%') AND (concept IS NULL OR concept = '');
UPDATE pyq_questions SET concept = 'CPU Organization & Instruction Formats' WHERE subject = 'DCME' AND (topic ILIKE '%Computer Organization%' OR topic ILIKE '%Architecture%') AND (concept IS NULL OR concept = '');
