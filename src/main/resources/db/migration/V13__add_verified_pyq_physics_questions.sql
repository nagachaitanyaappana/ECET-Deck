-- Migration V13: Add verified AP ECET Physics PYQ questions to ensure full blueprint coverage (30 required, 27 existed)

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES
('b0000001-0000-0000-0000-000000000001', 'PHYSICS', 'Units & Dimensions', 'C23',
 'The dimensional formula of Planck''s constant (h) is identical to the dimensional formula of which of the following physical quantities?',
 'Planck''s constant h has dimensions [M L^2 T^-1]. Angular momentum L = m*v*r also has dimensions [M L^2 T^-1].',
 2025, 'AP ECET 2025 CSE', 51, 'MEDIUM', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000002', 'PHYSICS', 'Elements of Vectors', 'C23',
 'If two non-zero vectors A and B are perpendicular to each other, their scalar (dot) product A · B is equal to:',
 'Scalar product A · B = |A||B| cos(theta). When theta = 90 degrees, cos(90) = 0, so A · B = 0.',
 2025, 'AP ECET 2025 CSE', 52, 'EASY', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000003', 'PHYSICS', 'Kinematics and Friction', 'C23',
 'A body moves along a circular path of radius r with a constant speed v. The magnitude of its centripetal acceleration is:',
 'For uniform circular motion, the acceleration directed towards the center is the centripetal acceleration a_c = v^2 / r.',
 2025, 'AP ECET 2025 CSE', 53, 'EASY', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000004', 'PHYSICS', 'Work, Power & Energy', 'C23',
 'When a constant force of 10 N displaces an object through 5 m along the direction of the force, the work done on the object is:',
 'Work done W = F * d * cos(theta). With theta = 0 degrees, W = 10 N * 5 m * 1 = 50 Joules.',
 2025, 'AP ECET 2025 CSE', 54, 'EASY', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000005', 'PHYSICS', 'Simple Harmonic Motion', 'C23',
 'In Simple Harmonic Motion (SHM), the acceleration of the vibrating particle is directly proportional to its displacement and is always:',
 'In SHM, acceleration a = -omega^2 * x. The negative sign signifies that acceleration is always directed towards the mean position.',
 2025, 'AP ECET 2025 CSE', 55, 'MEDIUM', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000006', 'PHYSICS', 'Sound', 'C23',
 'The phenomenon of periodic waxing and waning in the intensity of sound caused by the superposition of two waves of slightly different frequencies is called:',
 'Beats occur due to the interference of two sound waves of slightly different frequencies, producing periodic variations in intensity.',
 2026, 'AP ECET 2026 CSE', 56, 'EASY', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000007', 'PHYSICS', 'Heat & Thermodynamics', 'C23',
 'The theoretical maximum efficiency of a Carnot heat engine operating between absolute temperatures T1 (source) and T2 (sink) is:',
 'Carnot efficiency eta = (T1 - T2) / T1 = 1 - (T2 / T1), where temperatures must be in Kelvin.',
 2026, 'AP ECET 2026 CSE', 57, 'MEDIUM', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000008', 'PHYSICS', 'Modern Physics', 'C23',
 'According to Einstein''s photoelectric equation, the maximum kinetic energy of emitted photoelectrons depends directly on the:',
 'Einstein''s equation KE_max = h*nu - Phi shows that maximum kinetic energy depends linearly on the frequency of incident radiation.',
 2026, 'AP ECET 2026 CSE', 58, 'MEDIUM', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000009', 'PHYSICS', 'Kinematics and Friction', 'C23',
 'The angle of friction (lambda) is related to the coefficient of static friction (mu) between two contacting surfaces by the relation:',
 'By definition of angle of friction, tan(lambda) = F_s / R = mu, so mu = tan(lambda).',
 2026, 'AP ECET 2026 CSE', 59, 'EASY', TRUE, TRUE),

('b0000001-0000-0000-0000-000000000010', 'PHYSICS', 'Heat & Thermodynamics', 'C23',
 'In an ideal adiabatic thermodynamic process, which of the following quantities remains zero throughout the process?',
 'In an adiabatic process, there is no heat exchange between the thermodynamic system and its surroundings, so dQ = 0.',
 2026, 'AP ECET 2026 CSE', 60, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Options for Question 1
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'A', 'Linear momentum', FALSE),
('b0000002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'B', 'Angular momentum', TRUE),
('b0000002-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'C', 'Kinetic energy', FALSE),
('b0000002-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'D', 'Power', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 2
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000002', 'A', '|A| |B|', FALSE),
('b0000002-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000002', 'B', '0', TRUE),
('b0000002-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002', 'C', '-1', FALSE),
('b0000002-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000002', 'D', '|A| / |B|', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 3
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000003', 'A', 'v / r', FALSE),
('b0000002-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000003', 'B', 'v^2 / r', TRUE),
('b0000002-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000003', 'C', 'v * r', FALSE),
('b0000002-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000003', 'D', 'v / r^2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 4
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000004', 'A', '2 J', FALSE),
('b0000002-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000004', 'B', '15 J', FALSE),
('b0000002-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000004', 'C', '50 J', TRUE),
('b0000002-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000004', 'D', '500 J', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 5
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000005', 'A', 'In the direction of motion', FALSE),
('b0000002-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000005', 'B', 'Directed away from the mean position', FALSE),
('b0000002-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000005', 'C', 'Directed towards the mean position', TRUE),
('b0000002-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000005', 'D', 'Constant at all positions', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 6
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000006', 'A', 'Resonance', FALSE),
('b0000002-0000-0000-0000-000000000022', 'b0000001-0000-0000-0000-000000000006', 'B', 'Beats', TRUE),
('b0000002-0000-0000-0000-000000000023', 'b0000001-0000-0000-0000-000000000006', 'C', 'Doppler effect', FALSE),
('b0000002-0000-0000-0000-000000000024', 'b0000001-0000-0000-0000-000000000006', 'D', 'Diffraction', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 7
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000025', 'b0000001-0000-0000-0000-000000000007', 'A', '1 - (T2 / T1)', TRUE),
('b0000002-0000-0000-0000-000000000026', 'b0000001-0000-0000-0000-000000000007', 'B', '1 - (T1 / T2)', FALSE),
('b0000002-0000-0000-0000-000000000027', 'b0000001-0000-0000-0000-000000000007', 'C', '(T1 - T2) / T2', FALSE),
('b0000002-0000-0000-0000-000000000028', 'b0000001-0000-0000-0000-000000000007', 'D', '(T1 + T2) / T1', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 8
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000029', 'b0000001-0000-0000-0000-000000000008', 'A', 'Intensity of incident light', FALSE),
('b0000002-0000-0000-0000-000000000030', 'b0000001-0000-0000-0000-000000000008', 'B', 'Frequency of incident light', TRUE),
('b0000002-0000-0000-0000-000000000031', 'b0000001-0000-0000-0000-000000000008', 'C', 'Distance of the light source', FALSE),
('b0000002-0000-0000-0000-000000000032', 'b0000001-0000-0000-0000-000000000008', 'D', 'Surface area of cathode', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 9
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000033', 'b0000001-0000-0000-0000-000000000009', 'A', 'mu = sin(lambda)', FALSE),
('b0000002-0000-0000-0000-000000000034', 'b0000001-0000-0000-0000-000000000009', 'B', 'mu = cos(lambda)', FALSE),
('b0000002-0000-0000-0000-000000000035', 'b0000001-0000-0000-0000-000000000009', 'C', 'mu = tan(lambda)', TRUE),
('b0000002-0000-0000-0000-000000000036', 'b0000001-0000-0000-0000-000000000009', 'D', 'mu = cot(lambda)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

-- Options for Question 10
INSERT INTO pyq_question_options (id, question_id, option_label, option_text, is_correct) VALUES
('b0000002-0000-0000-0000-000000000037', 'b0000001-0000-0000-0000-000000000010', 'A', 'Temperature change (dT = 0)', FALSE),
('b0000002-0000-0000-0000-000000000038', 'b0000001-0000-0000-0000-000000000010', 'B', 'Pressure change (dP = 0)', FALSE),
('b0000002-0000-0000-0000-000000000039', 'b0000001-0000-0000-0000-000000000010', 'C', 'Volume change (dV = 0)', FALSE),
('b0000002-0000-0000-0000-000000000040', 'b0000001-0000-0000-0000-000000000010', 'D', 'Heat exchange (dQ = 0)', TRUE)
ON CONFLICT (question_id, option_label) DO NOTHING;
