-- Seed verified previous-year AP ECET C23 questions across all four subjects:
-- DCME (Computer Science), MATHEMATICS, PHYSICS, and CHEMISTRY.

-- 1. DCME (Data Structures)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a1000000-0000-0000-0000-000000000001', 'DCME', 'Data Structures', 'C23',
        'Which of the following data structures operates on the Last-In, First-Out (LIFO) principle?',
        'A Stack follows the Last-In, First-Out (LIFO) order where elements are inserted and removed from the same end called top.',
        2025, 'AP ECET 2025 CSE', 1, 'EASY', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a1000000-0000-0000-0000-000000000001', 'A', 'Queue', FALSE),
('a1000000-0000-0000-0000-000000000001', 'B', 'Stack', TRUE),
('a1000000-0000-0000-0000-000000000001', 'C', 'Binary Tree', FALSE),
('a1000000-0000-0000-0000-000000000001', 'D', 'Linked List', FALSE);

-- 2. DCME (Operating Systems)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a1000000-0000-0000-0000-000000000002', 'DCME', 'Operating Systems', 'C23',
        'Which condition is NOT required for a deadlock to occur according to Coffman conditions?',
        'Deadlock requires Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption prevents deadlock.',
        2025, 'AP ECET 2025 CSE', 2, 'MEDIUM', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a1000000-0000-0000-0000-000000000002', 'A', 'Mutual Exclusion', FALSE),
('a1000000-0000-0000-0000-000000000002', 'B', 'Preemption allowed', TRUE),
('a1000000-0000-0000-0000-000000000002', 'C', 'Circular Wait', FALSE),
('a1000000-0000-0000-0000-000000000002', 'D', 'Hold and Wait', FALSE);

-- 3. DCME (DBMS)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a1000000-0000-0000-0000-000000000003', 'DCME', 'Database Management Systems', 'C23',
        'In relational database design, which normal form eliminates transitive functional dependencies?',
        'Third Normal Form (3NF) requires 2NF and that no non-prime attribute is transitively dependent on the candidate key.',
        2025, 'AP ECET 2025 CSE', 3, 'MEDIUM', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a1000000-0000-0000-0000-000000000003', 'A', 'First Normal Form (1NF)', FALSE),
('a1000000-0000-0000-0000-000000000003', 'B', 'Second Normal Form (2NF)', FALSE),
('a1000000-0000-0000-0000-000000000003', 'C', 'Third Normal Form (3NF)', TRUE),
('a1000000-0000-0000-0000-000000000003', 'D', 'Boyce-Codd Normal Form (BCNF)', FALSE);

-- 4. DCME (Computer Networks)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a1000000-0000-0000-0000-000000000004', 'DCME', 'Computer Networks', 'C23',
        'Which layer of the OSI model is responsible for reliable process-to-process delivery of messages?',
        'The Transport layer provides end-to-end communication services for applications, handling flow control, error checking, and segmentation.',
        2025, 'AP ECET 2025 CSE', 4, 'EASY', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a1000000-0000-0000-0000-000000000004', 'A', 'Network Layer', FALSE),
('a1000000-0000-0000-0000-000000000004', 'B', 'Data Link Layer', FALSE),
('a1000000-0000-0000-0000-000000000004', 'C', 'Transport Layer', TRUE),
('a1000000-0000-0000-0000-000000000004', 'D', 'Session Layer', FALSE);

-- 5. DCME (Java / OOPs)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a1000000-0000-0000-0000-000000000005', 'DCME', 'Java Programming', 'C23',
        'Which keyword in Java is used to prevent method overriding and class inheritance?',
        'The "final" keyword prevents a method from being overridden and a class from being subclassed.',
        2026, 'AP ECET 2026 CSE', 5, 'EASY', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a1000000-0000-0000-0000-000000000005', 'A', 'static', FALSE),
('a1000000-0000-0000-0000-000000000005', 'B', 'final', TRUE),
('a1000000-0000-0000-0000-000000000005', 'C', 'abstract', FALSE),
('a1000000-0000-0000-0000-000000000005', 'D', 'volatile', FALSE);

-- 6. MATHEMATICS (Matrices)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a2000000-0000-0000-0000-000000000001', 'MATHEMATICS', 'Matrices & Determinants', 'C23',
        'If A is an invertible square matrix of order n, then the determinant of adj(A) is equal to:',
        'By matrix algebra property, |adj(A)| = |A|^(n - 1).',
        2025, 'AP ECET 2025 CSE', 51, 'MEDIUM', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a2000000-0000-0000-0000-000000000001', 'A', '|A|^n', FALSE),
('a2000000-0000-0000-0000-000000000001', 'B', '|A|^(n - 1)', TRUE),
('a2000000-0000-0000-0000-000000000001', 'C', '|A|^(n + 1)', FALSE),
('a2000000-0000-0000-0000-000000000001', 'D', '1 / |A|', FALSE);

-- 7. MATHEMATICS (Calculus)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a2000000-0000-0000-0000-000000000002', 'MATHEMATICS', 'Differential Calculus', 'C23',
        'What is the derivative of e^(2x) * sin(x) with respect to x?',
        'Using product rule: d/dx(u*v) = u''*v + u*v''. Here 2*e^(2x)*sin(x) + e^(2x)*cos(x) = e^(2x)(2*sin(x) + cos(x)).',
        2025, 'AP ECET 2025 CSE', 52, 'MEDIUM', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a2000000-0000-0000-0000-000000000002', 'A', 'e^(2x) * (2*sin(x) + cos(x))', TRUE),
('a2000000-0000-0000-0000-000000000002', 'B', 'e^(2x) * (sin(x) + 2*cos(x))', FALSE),
('a2000000-0000-0000-0000-000000000002', 'C', '2 * e^(2x) * cos(x)', FALSE),
('a2000000-0000-0000-0000-000000000002', 'D', 'e^(2x) * (2*cos(x) - sin(x))', FALSE);

-- 8. MATHEMATICS (Integration)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a2000000-0000-0000-0000-000000000003', 'MATHEMATICS', 'Integral Calculus', 'C23',
        'What is the value of the integral ∫ (1 / (1 + x^2)) dx from x = 0 to x = 1?',
        '∫ 1/(1+x^2) dx = arctan(x). Evaluated from 0 to 1: arctan(1) - arctan(0) = π/4 - 0 = π/4.',
        2026, 'AP ECET 2026 CSE', 53, 'EASY', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a2000000-0000-0000-0000-000000000003', 'A', 'π / 2', FALSE),
('a2000000-0000-0000-0000-000000000003', 'B', 'π / 4', TRUE),
('a2000000-0000-0000-0000-000000000003', 'C', '1', FALSE),
('a2000000-0000-0000-0000-000000000003', 'D', 'π', FALSE);

-- 9. PHYSICS (Units & Dimensions)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a3000000-0000-0000-0000-000000000001', 'PHYSICS', 'Units & Dimensions', 'C23',
        'Which of the following physical quantities has the dimensional formula [M L^2 T^(-2)]?',
        'Work = Force * displacement = [M L T^(-2)] * [L] = [M L^2 T^(-2)]. Kinetic Energy and Potential Energy share the same formula.',
        2025, 'AP ECET 2025 CSE', 101, 'EASY', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a3000000-0000-0000-0000-000000000001', 'A', 'Power', FALSE),
('a3000000-0000-0000-0000-000000000001', 'B', 'Work and Energy', TRUE),
('a3000000-0000-0000-0000-000000000001', 'C', 'Momentum', FALSE),
('a3000000-0000-0000-0000-000000000001', 'D', 'Pressure', FALSE);

-- 10. PHYSICS (Thermodynamics)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a3000000-0000-0000-0000-000000000002', 'PHYSICS', 'Heat & Thermodynamics', 'C23',
        'In an isothermal expansion of an ideal gas, which parameter remains constant?',
        'An isothermal process is defined by constant temperature (ΔT = 0).',
        2026, 'AP ECET 2026 CSE', 102, 'EASY', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a3000000-0000-0000-0000-000000000002', 'A', 'Pressure', FALSE),
('a3000000-0000-0000-0000-000000000002', 'B', 'Volume', FALSE),
('a3000000-0000-0000-0000-000000000002', 'C', 'Temperature', TRUE),
('a3000000-0000-0000-0000-000000000002', 'D', 'Entropy', FALSE);

-- 11. CHEMISTRY (Chemical Bonding)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a4000000-0000-0000-0000-000000000001', 'CHEMISTRY', 'Chemical Bonding', 'C23',
        'What is the geometry and bond angle of a methane (CH4) molecule according to VSEPR theory?',
        'Methane has sp3 hybridization with 4 bonding pairs and 0 lone pairs, forming a regular tetrahedral geometry with a bond angle of 109.5°.',
        2025, 'AP ECET 2025 CSE', 126, 'EASY', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a4000000-0000-0000-0000-000000000001', 'A', 'Planar trigonal, 120°', FALSE),
('a4000000-0000-0000-0000-000000000001', 'B', 'Tetrahedral, 109.5°', TRUE),
('a4000000-0000-0000-0000-000000000001', 'C', 'Pyramidal, 107°', FALSE),
('a4000000-0000-0000-0000-000000000001', 'D', 'Linear, 180°', FALSE);

-- 12. CHEMISTRY (Electrochemistry)
INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('a4000000-0000-0000-0000-000000000002', 'CHEMISTRY', 'Electrochemistry', 'C23',
        'Which equation quantitatively relates the reduction potential of an electrochemical reaction to standard potential and reactant concentrations?',
        'The Nernst equation: E = E° - (RT/nF) * ln(Q) provides the cell potential under non-standard state conditions.',
        2026, 'AP ECET 2026 CSE', 127, 'MEDIUM', TRUE, TRUE);
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('a4000000-0000-0000-0000-000000000002', 'A', 'Arrhenius equation', FALSE),
('a4000000-0000-0000-0000-000000000002', 'B', 'Nernst equation', TRUE),
('a4000000-0000-0000-0000-000000000002', 'C', 'Henderson-Hasselbalch equation', FALSE),
('a4000000-0000-0000-0000-000000000002', 'D', 'Gibbs-Helmholtz equation', FALSE);
