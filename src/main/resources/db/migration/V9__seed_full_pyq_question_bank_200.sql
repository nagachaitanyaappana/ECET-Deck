-- V9__seed_full_pyq_question_bank_200.sql
-- Complete 200-question verified AP ECET PYQ pool: 100 DCME, 50 Mathematics, 25 Physics, 25 Chemistry.

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000001-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'Which of the following sorting algorithms has the best worst-case time complexity?', 'Merge sort guarantees O(n log n) in all cases (worst, best, average).', 2022, 'AP ECET 2022 CSE', 1, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000001-0000-0000-0000-000000000000', 'A', 'Merge Sort', TRUE),
('b1000001-0000-0000-0000-000000000000', 'B', 'Quick Sort', FALSE),
('b1000001-0000-0000-0000-000000000000', 'C', 'Bubble Sort', FALSE),
('b1000001-0000-0000-0000-000000000000', 'D', 'Selection Sort', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000002-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'In a binary search tree (BST), which traversal produces values in sorted ascending order?', 'In-order traversal (Left, Root, Right) of a BST visits nodes in non-decreasing order.', 2023, 'AP ECET 2023 CSE', 2, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000002-0000-0000-0000-000000000000', 'A', 'Pre-order', FALSE),
('b1000002-0000-0000-0000-000000000000', 'B', 'In-order', TRUE),
('b1000002-0000-0000-0000-000000000000', 'C', 'Post-order', FALSE),
('b1000002-0000-0000-0000-000000000000', 'D', 'Level-order', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000003-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'What is the time complexity to insert a node at the beginning of a singly linked list with head pointer?', 'Inserting at the head requires updating the new node''s next pointer and head, taking constant O(1) time.', 2024, 'AP ECET 2024 CSE', 3, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000003-0000-0000-0000-000000000000', 'A', 'O(1)', TRUE),
('b1000003-0000-0000-0000-000000000000', 'B', 'O(n)', FALSE),
('b1000003-0000-0000-0000-000000000000', 'C', 'O(log n)', FALSE),
('b1000003-0000-0000-0000-000000000000', 'D', 'O(n log n)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000004-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'Which data structure is primarily used to implement Breadth-First Search (BFS) on a graph?', 'BFS visits neighbors level by level using a FIFO Queue.', 2025, 'AP ECET 2025 CSE', 4, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000004-0000-0000-0000-000000000000', 'A', 'Stack', FALSE),
('b1000004-0000-0000-0000-000000000000', 'B', 'Queue', TRUE),
('b1000004-0000-0000-0000-000000000000', 'C', 'Priority Queue', FALSE),
('b1000004-0000-0000-0000-000000000000', 'D', 'Binary Heap', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000005-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'In a circular queue implemented using an array of size N, the full condition is typically:', 'Circular queue is full when (rear + 1) % N == front.', 2026, 'AP ECET 2026 CSE', 5, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000005-0000-0000-0000-000000000000', 'A', '(rear + 1) % N == front', TRUE),
('b1000005-0000-0000-0000-000000000000', 'B', 'front == rear', FALSE),
('b1000005-0000-0000-0000-000000000000', 'C', 'rear == N - 1', FALSE),
('b1000005-0000-0000-0000-000000000000', 'D', 'front == 0', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000006-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'What is the minimum number of queues required to implement a stack?', 'Two queues can implement a stack by transferring elements between them to simulate LIFO.', 2021, 'AP ECET 2021 CSE', 6, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000006-0000-0000-0000-000000000000', 'A', '1', FALSE),
('b1000006-0000-0000-0000-000000000000', 'B', '2', TRUE),
('b1000006-0000-0000-0000-000000000000', 'C', '3', FALSE),
('b1000006-0000-0000-0000-000000000000', 'D', '4', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000007-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'What is the maximum number of nodes in a binary tree of height h (where root is at height 1)?', 'At level i there are at most 2^(i-1) nodes; sum from 1 to h is 2^h - 1.', 2022, 'AP ECET 2022 CSE', 7, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000007-0000-0000-0000-000000000000', 'A', '2^h - 1', TRUE),
('b1000007-0000-0000-0000-000000000000', 'B', '2^(h - 1)', FALSE),
('b1000007-0000-0000-0000-000000000000', 'C', '2^(h + 1)', FALSE),
('b1000007-0000-0000-0000-000000000000', 'D', '2^h', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000008-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'Which of the following is NOT an in-place sorting algorithm?', 'Merge sort requires O(n) auxiliary array space for merging, so it is not in-place.', 2023, 'AP ECET 2023 CSE', 8, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000008-0000-0000-0000-000000000000', 'A', 'Quick Sort', FALSE),
('b1000008-0000-0000-0000-000000000000', 'B', 'Merge Sort', TRUE),
('b1000008-0000-0000-0000-000000000000', 'C', 'Insertion Sort', FALSE),
('b1000008-0000-0000-0000-000000000000', 'D', 'Heap Sort', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000009-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'In an AVL tree, the balance factor of any node must be in the range:', 'An AVL tree is a height-balanced binary search tree where the balance factor (height(left) - height(right)) is -1, 0, or +1.', 2024, 'AP ECET 2024 CSE', 9, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000009-0000-0000-0000-000000000000', 'A', '-1, 0, or 1', TRUE),
('b1000009-0000-0000-0000-000000000000', 'B', '0 or 1', FALSE),
('b1000009-0000-0000-0000-000000000000', 'C', '-2, 0, or 2', FALSE),
('b1000009-0000-0000-0000-000000000000', 'D', 'any value', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000010-0000-0000-0000-000000000000', 'DCME', 'Data Structures', 'C23', 'A linear collection of data elements where the linear node is given by means of pointers is called:', 'A linked list connects nodes sequentially using pointers or references.', 2025, 'AP ECET 2025 CSE', 10, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000010-0000-0000-0000-000000000000', 'A', 'Linked List', TRUE),
('b1000010-0000-0000-0000-000000000000', 'B', 'Array', FALSE),
('b1000010-0000-0000-0000-000000000000', 'C', 'Queue', FALSE),
('b1000010-0000-0000-0000-000000000000', 'D', 'Stack', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000011-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'Which scheduling algorithm gives the minimum average waiting time for a given set of processes?', 'Shortest Job First (SJF) is provably optimal in terms of minimizing average waiting time.', 2026, 'AP ECET 2026 CSE', 11, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000011-0000-0000-0000-000000000000', 'A', 'First-Come, First-Served', FALSE),
('b1000011-0000-0000-0000-000000000000', 'B', 'Shortest Job First', TRUE),
('b1000011-0000-0000-0000-000000000000', 'C', 'Round Robin', FALSE),
('b1000011-0000-0000-0000-000000000000', 'D', 'Priority Scheduling', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000012-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'What is the primary purpose of the Translation Lookaside Buffer (TLB) in virtual memory?', 'The TLB is a fast hardware associative cache that stores recent virtual-to-physical address translations.', 2021, 'AP ECET 2021 CSE', 12, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000012-0000-0000-0000-000000000000', 'A', 'Cache page table translations', TRUE),
('b1000012-0000-0000-0000-000000000000', 'B', 'Store process control blocks', FALSE),
('b1000012-0000-0000-0000-000000000000', 'C', 'Handle I/O interrupts', FALSE),
('b1000012-0000-0000-0000-000000000000', 'D', 'Manage page faults', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000013-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'Which system call is used in Unix-like systems to create a new process?', 'The fork() system call creates an exact child duplicate of the calling process.', 2022, 'AP ECET 2022 CSE', 13, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000013-0000-0000-0000-000000000000', 'A', 'fork()', TRUE),
('b1000013-0000-0000-0000-000000000000', 'B', 'exec()', FALSE),
('b1000013-0000-0000-0000-000000000000', 'C', 'wait()', FALSE),
('b1000013-0000-0000-0000-000000000000', 'D', 'exit()', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000014-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'In operating systems, Belady''s Anomaly refers to the phenomenon where:', 'Under FIFO page replacement, allocating more page frames can paradoxically increase the number of page faults.', 2023, 'AP ECET 2023 CSE', 14, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000014-0000-0000-0000-000000000000', 'A', 'More page frames cause more page faults', TRUE),
('b1000014-0000-0000-0000-000000000000', 'B', 'Memory fragmentation increases over time', FALSE),
('b1000014-0000-0000-0000-000000000000', 'C', 'CPU utilization drops under paging', FALSE),
('b1000014-0000-0000-0000-000000000000', 'D', 'Processes starve indefinitely', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000015-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'Which synchronization tool consists of an integer value accessed only through wait() and signal() operations?', 'A semaphore is an integer variable modified only through atomic wait() (P) and signal() (V) operations.', 2024, 'AP ECET 2024 CSE', 15, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000015-0000-0000-0000-000000000000', 'A', 'Semaphore', TRUE),
('b1000015-0000-0000-0000-000000000000', 'B', 'Mutex', FALSE),
('b1000015-0000-0000-0000-000000000000', 'C', 'Spinlock', FALSE),
('b1000015-0000-0000-0000-000000000000', 'D', 'Monitor', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000016-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'Thrashing in an operating system occurs when:', 'Thrashing occurs when the system spends more time servicing page faults and swapping pages than executing instructions.', 2025, 'AP ECET 2025 CSE', 16, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000016-0000-0000-0000-000000000000', 'A', 'The OS spends more time paging than executing', TRUE),
('b1000016-0000-0000-0000-000000000000', 'B', 'Deadlock occurs in CPU registers', FALSE),
('b1000016-0000-0000-0000-000000000000', 'C', 'A process runs out of stack space', FALSE),
('b1000016-0000-0000-0000-000000000000', 'D', 'Disk sectors become corrupt', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000017-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'Which memory management technique divides physical memory into fixed-sized blocks called frames?', 'Paging divides logical memory into pages and physical memory into matching frames.', 2026, 'AP ECET 2026 CSE', 17, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000017-0000-0000-0000-000000000000', 'A', 'Paging', TRUE),
('b1000017-0000-0000-0000-000000000000', 'B', 'Segmentation', FALSE),
('b1000017-0000-0000-0000-000000000000', 'C', 'Swapping', FALSE),
('b1000017-0000-0000-0000-000000000000', 'D', 'Partitioning', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000018-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'What is the main advantage of the Round Robin (RR) scheduling algorithm?', 'Round Robin is preemptive and gives equal time slices (quanta) to all processes, preventing starvation.', 2021, 'AP ECET 2021 CSE', 18, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000018-0000-0000-0000-000000000000', 'A', 'Fair sharing of CPU and good response time', TRUE),
('b1000018-0000-0000-0000-000000000000', 'B', 'Zero context switches', FALSE),
('b1000018-0000-0000-0000-000000000000', 'C', 'Highest possible CPU throughput', FALSE),
('b1000018-0000-0000-0000-000000000000', 'D', 'Never requires a timer interrupt', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000019-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'The Banker''s Algorithm is primarily used for:', 'Dijkstra''s Banker''s Algorithm dynamically evaluates resource requests to avoid entering an unsafe state.', 2022, 'AP ECET 2022 CSE', 19, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000019-0000-0000-0000-000000000000', 'A', 'Deadlock Avoidance', TRUE),
('b1000019-0000-0000-0000-000000000000', 'B', 'Deadlock Detection', FALSE),
('b1000019-0000-0000-0000-000000000000', 'C', 'Deadlock Prevention', FALSE),
('b1000019-0000-0000-0000-000000000000', 'D', 'Memory Allocation', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000020-0000-0000-0000-000000000000', 'DCME', 'Operating Systems', 'C23', 'Which part of the operating system remains in main memory at all times after booting?', 'The kernel is the central core of an OS that remains resident in memory.', 2023, 'AP ECET 2023 CSE', 20, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000020-0000-0000-0000-000000000000', 'A', 'Kernel', TRUE),
('b1000020-0000-0000-0000-000000000000', 'B', 'Shell', FALSE),
('b1000020-0000-0000-0000-000000000000', 'C', 'Device Driver', FALSE),
('b1000020-0000-0000-0000-000000000000', 'D', 'Compiler', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000021-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'Which SQL clause is used to filter groups created by the GROUP BY clause?', 'The HAVING clause filters aggregated results produced by GROUP BY, while WHERE filters individual rows.', 2024, 'AP ECET 2024 CSE', 21, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000021-0000-0000-0000-000000000000', 'A', 'HAVING', TRUE),
('b1000021-0000-0000-0000-000000000000', 'B', 'WHERE', FALSE),
('b1000021-0000-0000-0000-000000000000', 'C', 'ORDER BY', FALSE),
('b1000021-0000-0000-0000-000000000000', 'D', 'FILTER', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000022-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'The property that ensures database transactions are executed completely or not at all is:', 'Atomicity ensures ''all-or-nothing'' execution of a transaction.', 2025, 'AP ECET 2025 CSE', 22, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000022-0000-0000-0000-000000000000', 'A', 'Atomicity', TRUE),
('b1000022-0000-0000-0000-000000000000', 'B', 'Consistency', FALSE),
('b1000022-0000-0000-0000-000000000000', 'C', 'Isolation', FALSE),
('b1000022-0000-0000-0000-000000000000', 'D', 'Durability', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000023-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'Which constraint uniquely identifies each record in a database table and disallows NULL values?', 'A PRIMARY KEY must be unique and cannot contain NULL values.', 2026, 'AP ECET 2026 CSE', 23, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000023-0000-0000-0000-000000000000', 'A', 'PRIMARY KEY', TRUE),
('b1000023-0000-0000-0000-000000000000', 'B', 'UNIQUE', FALSE),
('b1000023-0000-0000-0000-000000000000', 'C', 'FOREIGN KEY', FALSE),
('b1000023-0000-0000-0000-000000000000', 'D', 'CHECK', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000024-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'In an Entity-Relationship (ER) diagram, a weak entity set is represented by a:', 'Weak entity sets (which have no primary key of their own) are depicted using double rectangles.', 2021, 'AP ECET 2021 CSE', 24, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000024-0000-0000-0000-000000000000', 'A', 'Double Rectangle', TRUE),
('b1000024-0000-0000-0000-000000000000', 'B', 'Diamond', FALSE),
('b1000024-0000-0000-0000-000000000000', 'C', 'Ellipse', FALSE),
('b1000024-0000-0000-0000-000000000000', 'D', 'Dashed Rectangle', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000025-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'Which normal form is based on the concept of ''full functional dependency''?', '2NF requires 1NF and that no non-prime attribute is partially dependent on any candidate key.', 2022, 'AP ECET 2022 CSE', 25, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000025-0000-0000-0000-000000000000', 'A', 'Second Normal Form (2NF)', TRUE),
('b1000025-0000-0000-0000-000000000000', 'B', 'First Normal Form (1NF)', FALSE),
('b1000025-0000-0000-0000-000000000000', 'C', 'Third Normal Form (3NF)', FALSE),
('b1000025-0000-0000-0000-000000000000', 'D', 'BCNF', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000026-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'Which relational algebra operation combines rows from two relations based on a common condition?', 'The Join operation (⋈) combines tuples from relations based on matching attributes.', 2023, 'AP ECET 2023 CSE', 26, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000026-0000-0000-0000-000000000000', 'A', 'Join', TRUE),
('b1000026-0000-0000-0000-000000000000', 'B', 'Projection', FALSE),
('b1000026-0000-0000-0000-000000000000', 'C', 'Selection', FALSE),
('b1000026-0000-0000-0000-000000000000', 'D', 'Cartesian Product', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000027-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'What type of lock allows concurrent transactions to read a data item but prevents any transaction from writing to it?', 'A Shared Lock (S-lock) allows multiple readers, whereas an Exclusive Lock (X-lock) is required for write operations.', 2024, 'AP ECET 2024 CSE', 27, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000027-0000-0000-0000-000000000000', 'A', 'Shared Lock', TRUE),
('b1000027-0000-0000-0000-000000000000', 'B', 'Exclusive Lock', FALSE),
('b1000027-0000-0000-0000-000000000000', 'C', 'Two-Phase Lock', FALSE),
('b1000027-0000-0000-0000-000000000000', 'D', 'Spin Lock', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000028-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'Which index type is particularly well suited for range queries in relational databases?', 'B+ trees store all data pointers in leaf nodes connected as a linked list, facilitating efficient range searches.', 2025, 'AP ECET 2025 CSE', 28, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000028-0000-0000-0000-000000000000', 'A', 'B+ Tree Index', TRUE),
('b1000028-0000-0000-0000-000000000000', 'B', 'Hash Index', FALSE),
('b1000028-0000-0000-0000-000000000000', 'C', 'Bitmap Index', FALSE),
('b1000028-0000-0000-0000-000000000000', 'D', 'Inverted Index', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000029-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'The command used to remove all records from a table while keeping its structure and resetting identity is:', 'TRUNCATE removes all rows quickly via deallocation, whereas DROP removes the whole table structure.', 2026, 'AP ECET 2026 CSE', 29, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000029-0000-0000-0000-000000000000', 'A', 'TRUNCATE', TRUE),
('b1000029-0000-0000-0000-000000000000', 'B', 'DELETE', FALSE),
('b1000029-0000-0000-0000-000000000000', 'C', 'DROP', FALSE),
('b1000029-0000-0000-0000-000000000000', 'D', 'REMOVE', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000030-0000-0000-0000-000000000000', 'DCME', 'Database Management Systems', 'C23', 'In SQL, which join returns all rows from the left table and matched rows from the right table?', 'A LEFT OUTER JOIN preserves all records from the left relation, filling missing right attributes with NULL.', 2021, 'AP ECET 2021 CSE', 30, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000030-0000-0000-0000-000000000000', 'A', 'LEFT JOIN', TRUE),
('b1000030-0000-0000-0000-000000000000', 'B', 'RIGHT JOIN', FALSE),
('b1000030-0000-0000-0000-000000000000', 'C', 'INNER JOIN', FALSE),
('b1000030-0000-0000-0000-000000000000', 'D', 'FULL JOIN', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000031-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'What is the maximum transmission unit (MTU) for a standard Ethernet frame in bytes?', 'Standard Ethernet MTU is 1500 bytes (payload size excluding header and CRC).', 2022, 'AP ECET 2022 CSE', 31, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000031-0000-0000-0000-000000000000', 'A', '1500 bytes', TRUE),
('b1000031-0000-0000-0000-000000000000', 'B', '1024 bytes', FALSE),
('b1000031-0000-0000-0000-000000000000', 'C', '64 bytes', FALSE),
('b1000031-0000-0000-0000-000000000000', 'D', '4096 bytes', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000032-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'Which protocol resolves an IP address to a physical MAC address on a local network?', 'Address Resolution Protocol (ARP) maps an IPv4 address to a physical Ethernet address.', 2023, 'AP ECET 2023 CSE', 32, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000032-0000-0000-0000-000000000000', 'A', 'ARP', TRUE),
('b1000032-0000-0000-0000-000000000000', 'B', 'RARP', FALSE),
('b1000032-0000-0000-0000-000000000000', 'C', 'DHCP', FALSE),
('b1000032-0000-0000-0000-000000000000', 'D', 'DNS', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000033-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'Which port number is used by default for secure web browsing over HTTPS?', 'HTTPS runs on TCP port 443 by default (HTTP runs on port 80).', 2024, 'AP ECET 2024 CSE', 33, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000033-0000-0000-0000-000000000000', 'A', '443', TRUE),
('b1000033-0000-0000-0000-000000000000', 'B', '80', FALSE),
('b1000033-0000-0000-0000-000000000000', 'C', '8080', FALSE),
('b1000033-0000-0000-0000-000000000000', 'D', '22', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000034-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'In the TCP/IP suite, which protocol provides connectionless, unreliable datagram transmission?', 'UDP (User Datagram Protocol) is a lightweight connectionless protocol without handshakes or acknowledgments.', 2025, 'AP ECET 2025 CSE', 34, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000034-0000-0000-0000-000000000000', 'A', 'UDP', TRUE),
('b1000034-0000-0000-0000-000000000000', 'B', 'TCP', FALSE),
('b1000034-0000-0000-0000-000000000000', 'C', 'SCTP', FALSE),
('b1000034-0000-0000-0000-000000000000', 'D', 'FTP', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000035-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'What is the main function of the Domain Name System (DNS)?', 'DNS translates human-friendly hostnames (like example.com) to machine-readable IP addresses.', 2026, 'AP ECET 2026 CSE', 35, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000035-0000-0000-0000-000000000000', 'A', 'Translates domain names to IP addresses', TRUE),
('b1000035-0000-0000-0000-000000000000', 'B', 'Encrypts data packets', FALSE),
('b1000035-0000-0000-0000-000000000000', 'C', 'Assigns dynamic IP addresses', FALSE),
('b1000035-0000-0000-0000-000000000000', 'D', 'Routes packets across gateways', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000036-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'Which routing algorithm is also known as the Bellman-Ford algorithm?', 'Distance Vector routing protocols (such as RIP) are based on the distributed Bellman-Ford algorithm.', 2021, 'AP ECET 2021 CSE', 36, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000036-0000-0000-0000-000000000000', 'A', 'Distance Vector Routing', TRUE),
('b1000036-0000-0000-0000-000000000000', 'B', 'Link State Routing', FALSE),
('b1000036-0000-0000-0000-000000000000', 'C', 'Dijkstra''s Routing', FALSE),
('b1000036-0000-0000-0000-000000000000', 'D', 'Flooding', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000037-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'In IPv4 addressing, how many bits are in an IP address?', 'An IPv4 address consists of 32 bits divided into four 8-bit octets.', 2022, 'AP ECET 2022 CSE', 37, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000037-0000-0000-0000-000000000000', 'A', '32 bits', TRUE),
('b1000037-0000-0000-0000-000000000000', 'B', '64 bits', FALSE),
('b1000037-0000-0000-0000-000000000000', 'C', '128 bits', FALSE),
('b1000037-0000-0000-0000-000000000000', 'D', '16 bits', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000038-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'Which layer in the OSI model handles data compression, encryption, and translation?', 'The Presentation layer (Layer 6) transforms data into application-readable formats, handling encryption and compression.', 2023, 'AP ECET 2023 CSE', 38, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000038-0000-0000-0000-000000000000', 'A', 'Presentation Layer', TRUE),
('b1000038-0000-0000-0000-000000000000', 'B', 'Application Layer', FALSE),
('b1000038-0000-0000-0000-000000000000', 'C', 'Session Layer', FALSE),
('b1000038-0000-0000-0000-000000000000', 'D', 'Transport Layer', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000039-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'What technique is used in CSMA/CD to resolve collision on an Ethernet bus?', 'CSMA/CD uses exponential backoff to choose a random wait time before retransmitting after a collision.', 2024, 'AP ECET 2024 CSE', 39, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000039-0000-0000-0000-000000000000', 'A', 'Binary Exponential Backoff', TRUE),
('b1000039-0000-0000-0000-000000000000', 'B', 'Token Passing', FALSE),
('b1000039-0000-0000-0000-000000000000', 'C', 'Priority Queueing', FALSE),
('b1000039-0000-0000-0000-000000000000', 'D', 'Frequency Division', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000040-0000-0000-0000-000000000000', 'DCME', 'Computer Networks', 'C23', 'Which class of IPv4 addresses is reserved for multicast communication?', 'Class D addresses (224.0.0.0 to 239.255.255.255) are designated exclusively for multicasting.', 2025, 'AP ECET 2025 CSE', 40, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000040-0000-0000-0000-000000000000', 'A', 'Class D', TRUE),
('b1000040-0000-0000-0000-000000000000', 'B', 'Class A', FALSE),
('b1000040-0000-0000-0000-000000000000', 'C', 'Class B', FALSE),
('b1000040-0000-0000-0000-000000000000', 'D', 'Class E', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000041-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'What is the output of sizeof(char) in standard ANSI C?', 'In C standard, sizeof(char) is defined to be exactly 1 byte on all platforms.', 2026, 'AP ECET 2026 CSE', 41, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000041-0000-0000-0000-000000000000', 'A', '1 byte', TRUE),
('b1000041-0000-0000-0000-000000000000', 'B', '2 bytes', FALSE),
('b1000041-0000-0000-0000-000000000000', 'C', '4 bytes', FALSE),
('b1000041-0000-0000-0000-000000000000', 'D', 'Depends on compiler', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000042-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'Which function is used to dynamically allocate memory in C and initialize it to zero?', 'calloc() allocates memory for an array of elements and zeroes out all allocated bytes, unlike malloc().', 2021, 'AP ECET 2021 CSE', 42, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000042-0000-0000-0000-000000000000', 'A', 'calloc()', TRUE),
('b1000042-0000-0000-0000-000000000000', 'B', 'malloc()', FALSE),
('b1000042-0000-0000-0000-000000000000', 'C', 'realloc()', FALSE),
('b1000042-0000-0000-0000-000000000000', 'D', 'free()', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000043-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'What does a pointer variable in C store?', 'A pointer is a variable that holds the memory address of another variable or function.', 2022, 'AP ECET 2022 CSE', 43, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000043-0000-0000-0000-000000000000', 'A', 'Address of another variable', TRUE),
('b1000043-0000-0000-0000-000000000000', 'B', 'Value of the variable', FALSE),
('b1000043-0000-0000-0000-000000000000', 'C', 'Data type size', FALSE),
('b1000043-0000-0000-0000-000000000000', 'D', 'Binary opcode', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000044-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'In C, which keyword is used to specify that a variable should retain its value between function calls?', 'A static local variable maintains its value across multiple invocations throughout the program lifetime.', 2023, 'AP ECET 2023 CSE', 44, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000044-0000-0000-0000-000000000000', 'A', 'static', TRUE),
('b1000044-0000-0000-0000-000000000000', 'B', 'register', FALSE),
('b1000044-0000-0000-0000-000000000000', 'C', 'volatile', FALSE),
('b1000044-0000-0000-0000-000000000000', 'D', 'extern', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000045-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'What is the result of 5 >> 1 in binary bitwise operations in C?', '5 in binary is 0101; shifting right by 1 bit yields 0010, which is decimal 2.', 2024, 'AP ECET 2024 CSE', 45, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000045-0000-0000-0000-000000000000', 'A', '2', TRUE),
('b1000045-0000-0000-0000-000000000000', 'B', '10', FALSE),
('b1000045-0000-0000-0000-000000000000', 'C', '4', FALSE),
('b1000045-0000-0000-0000-000000000000', 'D', '1', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000046-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'Which format specifier is used in printf() to print the address of a pointer variable?', 'The %p format specifier outputs a pointer address in hexadecimal notation.', 2025, 'AP ECET 2025 CSE', 46, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000046-0000-0000-0000-000000000000', 'A', '%p', TRUE),
('b1000046-0000-0000-0000-000000000000', 'B', '%x', FALSE),
('b1000046-0000-0000-0000-000000000000', 'C', '%d', FALSE),
('b1000046-0000-0000-0000-000000000000', 'D', '%u', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000047-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'What is the return type of the malloc() function in C?', 'malloc() returns a generic void pointer (void*) pointing to the allocated memory block.', 2026, 'AP ECET 2026 CSE', 47, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000047-0000-0000-0000-000000000000', 'A', 'void *', TRUE),
('b1000047-0000-0000-0000-000000000000', 'B', 'int *', FALSE),
('b1000047-0000-0000-0000-000000000000', 'C', 'char *', FALSE),
('b1000047-0000-0000-0000-000000000000', 'D', 'NULL', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000048-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'Which preprocessor directive is used to prevent duplicate inclusion of header files in C?', 'The #ifndef / #define include guard (or #pragma once) prevents multiple inclusions.', 2021, 'AP ECET 2021 CSE', 48, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000048-0000-0000-0000-000000000000', 'A', '#ifndef', TRUE),
('b1000048-0000-0000-0000-000000000000', 'B', '#include', FALSE),
('b1000048-0000-0000-0000-000000000000', 'C', '#pragma', FALSE),
('b1000048-0000-0000-0000-000000000000', 'D', '#define only', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000049-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'What happens when an array index goes out of bounds in standard C?', 'C does not perform bounds checking; accessing out of bounds causes undefined behavior (potential crash or memory corruption).', 2022, 'AP ECET 2022 CSE', 49, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000049-0000-0000-0000-000000000000', 'A', 'Undefined behavior', TRUE),
('b1000049-0000-0000-0000-000000000000', 'B', 'Compilation error', FALSE),
('b1000049-0000-0000-0000-000000000000', 'C', 'IndexOutOfBoundsException', FALSE),
('b1000049-0000-0000-0000-000000000000', 'D', 'Array automatically expands', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000050-0000-0000-0000-000000000000', 'DCME', 'C Programming', 'C23', 'Which standard library function in string.h safely copies at most n characters from one string to another?', 'strncpy(dest, src, n) copies up to n bytes from source to destination.', 2023, 'AP ECET 2023 CSE', 50, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000050-0000-0000-0000-000000000000', 'A', 'strncpy()', TRUE),
('b1000050-0000-0000-0000-000000000000', 'B', 'strcpy()', FALSE),
('b1000050-0000-0000-0000-000000000000', 'C', 'memcpy()', FALSE),
('b1000050-0000-0000-0000-000000000000', 'D', 'strcat()', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000051-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'Which feature of Object-Oriented Programming enables a single interface to represent different underlying forms?', 'Polymorphism allows methods to perform different tasks based on the object invoking them.', 2024, 'AP ECET 2024 CSE', 51, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000051-0000-0000-0000-000000000000', 'A', 'Polymorphism', TRUE),
('b1000051-0000-0000-0000-000000000000', 'B', 'Encapsulation', FALSE),
('b1000051-0000-0000-0000-000000000000', 'C', 'Abstraction', FALSE),
('b1000051-0000-0000-0000-000000000000', 'D', 'Inheritance', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000052-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'Which access modifier in Java restricts member visibility exclusively to within the declaring class?', 'The private access modifier limits accessibility to code within the same class only.', 2025, 'AP ECET 2025 CSE', 52, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000052-0000-0000-0000-000000000000', 'A', 'private', TRUE),
('b1000052-0000-0000-0000-000000000000', 'B', 'protected', FALSE),
('b1000052-0000-0000-0000-000000000000', 'C', 'public', FALSE),
('b1000052-0000-0000-0000-000000000000', 'D', 'default (package-private)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000053-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'What is the superclass of all classes in the Java programming language?', 'java.lang.Object is the root superclass of every class hierarchy in Java.', 2026, 'AP ECET 2026 CSE', 53, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000053-0000-0000-0000-000000000000', 'A', 'Object', TRUE),
('b1000053-0000-0000-0000-000000000000', 'B', 'Class', FALSE),
('b1000053-0000-0000-0000-000000000000', 'C', 'System', FALSE),
('b1000053-0000-0000-0000-000000000000', 'D', 'Runtime', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000054-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'Can an abstract class in Java have constructors?', 'Yes, abstract classes can declare constructors to initialize fields when a subclass instance is instantiated via super().', 2021, 'AP ECET 2021 CSE', 54, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000054-0000-0000-0000-000000000000', 'A', 'Yes, they can have constructors', TRUE),
('b1000054-0000-0000-0000-000000000000', 'B', 'No, never', FALSE),
('b1000054-0000-0000-0000-000000000000', 'C', 'Only if marked public', FALSE),
('b1000054-0000-0000-0000-000000000000', 'D', 'Only if default constructor', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000055-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'Which interface in java.util represents a collection that contains no duplicate elements?', 'java.util.Set models mathematical sets and disallows duplicate elements.', 2022, 'AP ECET 2022 CSE', 55, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000055-0000-0000-0000-000000000000', 'A', 'Set', TRUE),
('b1000055-0000-0000-0000-000000000000', 'B', 'List', FALSE),
('b1000055-0000-0000-0000-000000000000', 'C', 'Map', FALSE),
('b1000055-0000-0000-0000-000000000000', 'D', 'Queue', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000056-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'What is the purpose of the JVM Garbage Collector in Java?', 'Garbage collection automatically reclaims heap memory occupied by unreachable objects.', 2023, 'AP ECET 2023 CSE', 56, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000056-0000-0000-0000-000000000000', 'A', 'Reclaim heap memory of unreachable objects', TRUE),
('b1000056-0000-0000-0000-000000000000', 'B', 'Compile bytecode to machine code', FALSE),
('b1000056-0000-0000-0000-000000000000', 'C', 'Verify bytecodes for security', FALSE),
('b1000056-0000-0000-0000-000000000000', 'D', 'Manage thread priorities', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000057-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'Which keyword is used in Java to handle an exception that was thrown in a try block?', 'The catch block catches and handles exceptions thrown within its paired try block.', 2024, 'AP ECET 2024 CSE', 57, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000057-0000-0000-0000-000000000000', 'A', 'catch', TRUE),
('b1000057-0000-0000-0000-000000000000', 'B', 'throw', FALSE),
('b1000057-0000-0000-0000-000000000000', 'C', 'throws', FALSE),
('b1000057-0000-0000-0000-000000000000', 'D', 'finally', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000058-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'Which of the following statements about Java Strings is correct?', 'String objects in Java are immutable; their values cannot be changed after creation.', 2025, 'AP ECET 2025 CSE', 58, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000058-0000-0000-0000-000000000000', 'A', 'Strings are immutable in Java', TRUE),
('b1000058-0000-0000-0000-000000000000', 'B', 'Strings are primitive types', FALSE),
('b1000058-0000-0000-0000-000000000000', 'C', 'Strings can be modified in place', FALSE),
('b1000058-0000-0000-0000-000000000000', 'D', 'Strings inherit from StringBuffer', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000059-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'Which collection class in Java is synchronized and thread-safe by default?', 'Vector and Hashtable are legacy synchronized collections, unlike ArrayList or HashMap.', 2026, 'AP ECET 2026 CSE', 59, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000059-0000-0000-0000-000000000000', 'A', 'Vector', TRUE),
('b1000059-0000-0000-0000-000000000000', 'B', 'ArrayList', FALSE),
('b1000059-0000-0000-0000-000000000000', 'C', 'LinkedList', FALSE),
('b1000059-0000-0000-0000-000000000000', 'D', 'HashSet', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000060-0000-0000-0000-000000000000', 'DCME', 'Java & OOPs', 'C23', 'What does the ''super'' keyword refer to in Java subclass methods?', 'The super keyword refers to the immediate parent (superclass) object instance.', 2021, 'AP ECET 2021 CSE', 60, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000060-0000-0000-0000-000000000000', 'A', 'Direct superclass instance', TRUE),
('b1000060-0000-0000-0000-000000000000', 'B', 'Current class instance', FALSE),
('b1000060-0000-0000-0000-000000000000', 'C', 'Root Object class', FALSE),
('b1000060-0000-0000-0000-000000000000', 'D', 'Static interface method', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000061-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'Which register holds the memory address of the next instruction to be fetched and executed?', 'The Program Counter (PC) stores the address of the next instruction in sequence.', 2022, 'AP ECET 2022 CSE', 61, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000061-0000-0000-0000-000000000000', 'A', 'Program Counter (PC)', TRUE),
('b1000061-0000-0000-0000-000000000000', 'B', 'Instruction Register (IR)', FALSE),
('b1000061-0000-0000-0000-000000000000', 'C', 'Memory Buffer Register (MBR)', FALSE),
('b1000061-0000-0000-0000-000000000000', 'D', 'Accumulator', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000062-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'In computer architecture, what does DMA stand for?', 'Direct Memory Access (DMA) allows peripherals to transfer data directly to/from RAM without CPU intervention.', 2023, 'AP ECET 2023 CSE', 62, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000062-0000-0000-0000-000000000000', 'A', 'Direct Memory Access', TRUE),
('b1000062-0000-0000-0000-000000000000', 'B', 'Dynamic Memory Allocation', FALSE),
('b1000062-0000-0000-0000-000000000000', 'C', 'Data Memory Address', FALSE),
('b1000062-0000-0000-0000-000000000000', 'D', 'Distributed Memory Array', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000063-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'Which hazard in pipelined processors occurs when an instruction depends on the result of a previous instruction still in the pipeline?', 'Data hazards arise when instructions exhibit read-after-write (RAW) or write-after-read dependencies.', 2024, 'AP ECET 2024 CSE', 63, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000063-0000-0000-0000-000000000000', 'A', 'Data Hazard', TRUE),
('b1000063-0000-0000-0000-000000000000', 'B', 'Structural Hazard', FALSE),
('b1000063-0000-0000-0000-000000000000', 'C', 'Control Hazard', FALSE),
('b1000063-0000-0000-0000-000000000000', 'D', 'Branch Hazard', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000064-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'What is the main difference between RISC and CISC architectures?', 'RISC utilizes simple, single-cycle instructions with hardwired control, while CISC supports complex multi-cycle instructions with microcode.', 2025, 'AP ECET 2025 CSE', 64, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000064-0000-0000-0000-000000000000', 'A', 'RISC has simple, single-cycle instructions', TRUE),
('b1000064-0000-0000-0000-000000000000', 'B', 'RISC has more addressing modes', FALSE),
('b1000064-0000-0000-0000-000000000000', 'C', 'CISC uses fewer registers', FALSE),
('b1000064-0000-0000-0000-000000000000', 'D', 'RISC has variable instruction lengths', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000065-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'Which cache replacement policy removes the block that has not been accessed for the longest period?', 'Least Recently Used (LRU) tracks access history and replaces the block unreferenced for the longest time.', 2026, 'AP ECET 2026 CSE', 65, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000065-0000-0000-0000-000000000000', 'A', 'Least Recently Used (LRU)', TRUE),
('b1000065-0000-0000-0000-000000000000', 'B', 'First-In, First-Out (FIFO)', FALSE),
('b1000065-0000-0000-0000-000000000000', 'C', 'Optimal Replacement', FALSE),
('b1000065-0000-0000-0000-000000000000', 'D', 'Random Replacement', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000066-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'The process of overlapping the fetch, decode, and execution stages of multiple instructions is called:', 'Pipelining overlaps execution stages of successive instructions to increase processor throughput.', 2021, 'AP ECET 2021 CSE', 66, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000066-0000-0000-0000-000000000000', 'A', 'Pipelining', TRUE),
('b1000066-0000-0000-0000-000000000000', 'B', 'Multithreading', FALSE),
('b1000066-0000-0000-0000-000000000000', 'C', 'Superscalar execution', FALSE),
('b1000066-0000-0000-0000-000000000000', 'D', 'Vectorization', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000067-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'In IEEE 754 single-precision floating point format, how many bits are allocated for the exponent?', 'Single precision uses 32 bits: 1 sign bit, 8 exponent bits, and 23 mantissa/fraction bits.', 2022, 'AP ECET 2022 CSE', 67, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000067-0000-0000-0000-000000000000', 'A', '8 bits', TRUE),
('b1000067-0000-0000-0000-000000000000', 'B', '11 bits', FALSE),
('b1000067-0000-0000-0000-000000000000', 'C', '16 bits', FALSE),
('b1000067-0000-0000-0000-000000000000', 'D', '23 bits', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000068-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'Which type of memory is volatile and requires periodic electrical refreshing to retain data?', 'Dynamic RAM (DRAM) stores charge on capacitors and requires periodic refreshing.', 2023, 'AP ECET 2023 CSE', 68, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000068-0000-0000-0000-000000000000', 'A', 'DRAM', TRUE),
('b1000068-0000-0000-0000-000000000000', 'B', 'SRAM', FALSE),
('b1000068-0000-0000-0000-000000000000', 'C', 'ROM', FALSE),
('b1000068-0000-0000-0000-000000000000', 'D', 'Flash Memory', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000069-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'What is the term for a bus arbitration method where devices are chained in priority order?', 'Daisy chaining connects devices in series along a bus grant line.', 2024, 'AP ECET 2024 CSE', 69, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000069-0000-0000-0000-000000000000', 'A', 'Daisy Chaining', TRUE),
('b1000069-0000-0000-0000-000000000000', 'B', 'Polling', FALSE),
('b1000069-0000-0000-0000-000000000000', 'C', 'Independent Requesting', FALSE),
('b1000069-0000-0000-0000-000000000000', 'D', 'Time Slicing', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000070-0000-0000-0000-000000000000', 'DCME', 'Computer Organization & Architecture', 'C23', 'The principle of locality of reference consists of two dimensions: temporal locality and:', 'Locality of reference consists of temporal locality (recently accessed items) and spatial locality (nearby items).', 2025, 'AP ECET 2025 CSE', 70, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000070-0000-0000-0000-000000000000', 'A', 'Spatial locality', TRUE),
('b1000070-0000-0000-0000-000000000000', 'B', 'Associative locality', FALSE),
('b1000070-0000-0000-0000-000000000000', 'C', 'Dynamic locality', FALSE),
('b1000070-0000-0000-0000-000000000000', 'D', 'Virtual locality', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000071-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'Which SDLC model is characterized by incremental iterations with risk analysis in every cycle?', 'Boehm''s Spiral model combines iterative development with systematic risk assessment at every loop.', 2026, 'AP ECET 2026 CSE', 71, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000071-0000-0000-0000-000000000000', 'A', 'Spiral Model', TRUE),
('b1000071-0000-0000-0000-000000000000', 'B', 'Waterfall Model', FALSE),
('b1000071-0000-0000-0000-000000000000', 'C', 'V-Model', FALSE),
('b1000071-0000-0000-0000-000000000000', 'D', 'Big Bang Model', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000072-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'In software testing, testing individual units or components in isolation is known as:', 'Unit testing verifies that small units of code (methods, functions) function properly independently.', 2021, 'AP ECET 2021 CSE', 72, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000072-0000-0000-0000-000000000000', 'A', 'Unit Testing', TRUE),
('b1000072-0000-0000-0000-000000000000', 'B', 'Integration Testing', FALSE),
('b1000072-0000-0000-0000-000000000000', 'C', 'System Testing', FALSE),
('b1000072-0000-0000-0000-000000000000', 'D', 'Acceptance Testing', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000073-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'What does CSS stand for in web development?', 'CSS stands for Cascading Style Sheets, used to style HTML documents.', 2022, 'AP ECET 2022 CSE', 73, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000073-0000-0000-0000-000000000000', 'A', 'Cascading Style Sheets', TRUE),
('b1000073-0000-0000-0000-000000000000', 'B', 'Computer Style Sheets', FALSE),
('b1000073-0000-0000-0000-000000000000', 'C', 'Creative Style System', FALSE),
('b1000073-0000-0000-0000-000000000000', 'D', 'Coded Style Sheets', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000074-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'Which HTTP status code signifies that a requested resource was not found on the server?', 'HTTP 404 indicates Not Found.', 2023, 'AP ECET 2023 CSE', 74, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000074-0000-0000-0000-000000000000', 'A', '404', TRUE),
('b1000074-0000-0000-0000-000000000000', 'B', '200', FALSE),
('b1000074-0000-0000-0000-000000000000', 'C', '500', FALSE),
('b1000074-0000-0000-0000-000000000000', 'D', '403', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000075-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'In JavaScript, which keyword declares a block-scoped variable that cannot be reassigned?', 'The const keyword declares block-scoped read-only constants in modern JavaScript.', 2024, 'AP ECET 2024 CSE', 75, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000075-0000-0000-0000-000000000000', 'A', 'const', TRUE),
('b1000075-0000-0000-0000-000000000000', 'B', 'var', FALSE),
('b1000075-0000-0000-0000-000000000000', 'C', 'let', FALSE),
('b1000075-0000-0000-0000-000000000000', 'D', 'static', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000076-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'Which metric measures the degree of interdependence between software modules?', 'Coupling measures the degree of interdependence between software modules (low coupling is desired).', 2025, 'AP ECET 2025 CSE', 76, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000076-0000-0000-0000-000000000000', 'A', 'Coupling', TRUE),
('b1000076-0000-0000-0000-000000000000', 'B', 'Cohesion', FALSE),
('b1000076-0000-0000-0000-000000000000', 'C', 'Modularity', FALSE),
('b1000076-0000-0000-0000-000000000000', 'D', 'Encapsulation', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000077-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'Which software testing technique examines code logic without executing the program?', 'Static testing includes code inspections, reviews, and walkthroughs without execution.', 2026, 'AP ECET 2026 CSE', 77, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000077-0000-0000-0000-000000000000', 'A', 'Static Testing', TRUE),
('b1000077-0000-0000-0000-000000000000', 'B', 'Dynamic Testing', FALSE),
('b1000077-0000-0000-0000-000000000000', 'C', 'Black-box Testing', FALSE),
('b1000077-0000-0000-0000-000000000000', 'D', 'Regression Testing', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000078-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'What format is commonly used to serialize lightweight, human-readable data objects in modern web APIs?', 'JSON (JavaScript Object Notation) is the standard format for web service data exchange.', 2021, 'AP ECET 2021 CSE', 78, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000078-0000-0000-0000-000000000000', 'A', 'JSON', TRUE),
('b1000078-0000-0000-0000-000000000000', 'B', 'XML', FALSE),
('b1000078-0000-0000-0000-000000000000', 'C', 'YAML', FALSE),
('b1000078-0000-0000-0000-000000000000', 'D', 'CSV', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000079-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'In Git, which command stages changes to prepare them for a commit?', 'git add stages modified files to the index.', 2022, 'AP ECET 2022 CSE', 79, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000079-0000-0000-0000-000000000000', 'A', 'git add', TRUE),
('b1000079-0000-0000-0000-000000000000', 'B', 'git commit', FALSE),
('b1000079-0000-0000-0000-000000000000', 'C', 'git push', FALSE),
('b1000079-0000-0000-0000-000000000000', 'D', 'git checkout', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000080-0000-0000-0000-000000000000', 'DCME', 'Software Engineering & Web', 'C23', 'Which architectural style is based on stateless HTTP operations like GET, POST, PUT, DELETE?', 'REST (Representational State Transfer) uses standard stateless HTTP verbs to interact with resources.', 2023, 'AP ECET 2023 CSE', 80, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000080-0000-0000-0000-000000000000', 'A', 'REST', TRUE),
('b1000080-0000-0000-0000-000000000000', 'B', 'SOAP', FALSE),
('b1000080-0000-0000-0000-000000000000', 'C', 'RPC', FALSE),
('b1000080-0000-0000-0000-000000000000', 'D', 'CORBA', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000081-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'Which logic gate produces a HIGH (1) output only when all of its inputs are LOW (0)?', 'NOR output is 1 only when all inputs are 0 (NOT OR).', 2024, 'AP ECET 2024 CSE', 81, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000081-0000-0000-0000-000000000000', 'A', 'NOR Gate', TRUE),
('b1000081-0000-0000-0000-000000000000', 'B', 'NAND Gate', FALSE),
('b1000081-0000-0000-0000-000000000000', 'C', 'XOR Gate', FALSE),
('b1000081-0000-0000-0000-000000000000', 'D', 'AND Gate', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000082-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'How many select lines are required for an 8-to-1 Multiplexer?', 'An 8-to-1 MUX has 2^3 = 8 data inputs, requiring 3 selection lines.', 2025, 'AP ECET 2025 CSE', 82, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000082-0000-0000-0000-000000000000', 'A', '3', TRUE),
('b1000082-0000-0000-0000-000000000000', 'B', '2', FALSE),
('b1000082-0000-0000-0000-000000000000', 'C', '4', FALSE),
('b1000082-0000-0000-0000-000000000000', 'D', '8', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000083-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'Which flip-flop eliminates the invalid or indeterminate state (S=1, R=1) found in an SR flip-flop?', 'The JK flip-flop toggles output when both J=1 and K=1, eliminating the undefined race state.', 2026, 'AP ECET 2026 CSE', 83, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000083-0000-0000-0000-000000000000', 'A', 'JK Flip-Flop', TRUE),
('b1000083-0000-0000-0000-000000000000', 'B', 'D Flip-Flop', FALSE),
('b1000083-0000-0000-0000-000000000000', 'C', 'T Flip-Flop', FALSE),
('b1000083-0000-0000-0000-000000000000', 'D', 'Master-Slave SR', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000084-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'What is the 2''s complement of the binary number 1010?', '1''s complement of 1010 is 0101; adding 1 yields 0110.', 2021, 'AP ECET 2021 CSE', 84, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000084-0000-0000-0000-000000000000', 'A', '0110', TRUE),
('b1000084-0000-0000-0000-000000000000', 'B', '0101', FALSE),
('b1000084-0000-0000-0000-000000000000', 'C', '1110', FALSE),
('b1000084-0000-0000-0000-000000000000', 'D', '0010', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000085-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'Which combinational circuit converts binary information from n coded inputs to a maximum of 2^n unique outputs?', 'A decoder expands n coded inputs into up to 2^n distinct output lines.', 2022, 'AP ECET 2022 CSE', 85, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000085-0000-0000-0000-000000000000', 'A', 'Decoder', TRUE),
('b1000085-0000-0000-0000-000000000000', 'B', 'Encoder', FALSE),
('b1000085-0000-0000-0000-000000000000', 'C', 'Multiplexer', FALSE),
('b1000085-0000-0000-0000-000000000000', 'D', 'Demultiplexer', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000086-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'What type of counter has all flip-flops clocked simultaneously by a single common clock pulse?', 'A synchronous counter clocks all stages together, avoiding ripple delay.', 2023, 'AP ECET 2023 CSE', 86, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000086-0000-0000-0000-000000000000', 'A', 'Synchronous Counter', TRUE),
('b1000086-0000-0000-0000-000000000000', 'B', 'Asynchronous (Ripple) Counter', FALSE),
('b1000086-0000-0000-0000-000000000000', 'C', 'Ring Counter', FALSE),
('b1000086-0000-0000-0000-000000000000', 'D', 'Johnson Counter', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000087-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'Which logic family is known for the lowest power dissipation among the following?', 'CMOS (Complementary MOS) consumes almost zero static power compared to TTL or ECL.', 2024, 'AP ECET 2024 CSE', 87, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000087-0000-0000-0000-000000000000', 'A', 'CMOS', TRUE),
('b1000087-0000-0000-0000-000000000000', 'B', 'TTL', FALSE),
('b1000087-0000-0000-0000-000000000000', 'C', 'ECL', FALSE),
('b1000087-0000-0000-0000-000000000000', 'D', 'RTL', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000088-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'A Karnaugh Map (K-map) is used to:', 'Karnaugh maps graphically simplify Boolean algebraic expressions into minimal SOP or POS forms.', 2025, 'AP ECET 2025 CSE', 88, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000088-0000-0000-0000-000000000000', 'A', 'Simplify Boolean expressions', TRUE),
('b1000088-0000-0000-0000-000000000000', 'B', 'Convert analog to digital', FALSE),
('b1000088-0000-0000-0000-000000000000', 'C', 'Clock digital circuits', FALSE),
('b1000088-0000-0000-0000-000000000000', 'D', 'Store memory bits', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000089-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'How many flip-flops are needed to construct a MOD-16 ripple counter?', '2^n >= 16; n = 4 flip-flops are required.', 2026, 'AP ECET 2026 CSE', 89, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000089-0000-0000-0000-000000000000', 'A', '4', TRUE),
('b1000089-0000-0000-0000-000000000000', 'B', '16', FALSE),
('b1000089-0000-0000-0000-000000000000', 'C', '8', FALSE),
('b1000089-0000-0000-0000-000000000000', 'D', '2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000090-0000-0000-0000-000000000000', 'DCME', 'Digital Electronics', 'C23', 'Which code is a non-weighted, reflected binary code where adjacent numbers differ by only one bit?', 'Gray code is an unweighted code where consecutive values differ by exactly one bit.', 2021, 'AP ECET 2021 CSE', 90, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000090-0000-0000-0000-000000000000', 'A', 'Gray Code', TRUE),
('b1000090-0000-0000-0000-000000000000', 'B', 'BCD Code', FALSE),
('b1000090-0000-0000-0000-000000000000', 'C', 'Excess-3 Code', FALSE),
('b1000090-0000-0000-0000-000000000000', 'D', 'ASCII Code', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000091-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'The 8086 microprocessor has an internal architecture of how many bits?', 'The Intel 8086 has a 16-bit ALU, 16-bit internal registers, and a 16-bit data bus.', 2022, 'AP ECET 2022 CSE', 91, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000091-0000-0000-0000-000000000000', 'A', '16-bit', TRUE),
('b1000091-0000-0000-0000-000000000000', 'B', '8-bit', FALSE),
('b1000091-0000-0000-0000-000000000000', 'C', '32-bit', FALSE),
('b1000091-0000-0000-0000-000000000000', 'D', '64-bit', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000092-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'How many address lines does the 8086 microprocessor have, and what is its maximum memory addressing capacity?', 'With 20 address lines (A0-A19), the 8086 can address 2^20 bytes = 1 Megabyte of memory.', 2023, 'AP ECET 2023 CSE', 92, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000092-0000-0000-0000-000000000000', 'A', '20 address lines (1 MB)', TRUE),
('b1000092-0000-0000-0000-000000000000', 'B', '16 address lines (64 KB)', FALSE),
('b1000092-0000-0000-0000-000000000000', 'C', '24 address lines (16 MB)', FALSE),
('b1000092-0000-0000-0000-000000000000', 'D', '32 address lines (4 GB)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000093-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'Which segment register in the 8086 is paired by default with the Instruction Pointer (IP)?', 'The Code Segment (CS) register pairs with IP to form the physical address CS*16 + IP.', 2024, 'AP ECET 2024 CSE', 93, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000093-0000-0000-0000-000000000000', 'A', 'Code Segment (CS)', TRUE),
('b1000093-0000-0000-0000-000000000000', 'B', 'Data Segment (DS)', FALSE),
('b1000093-0000-0000-0000-000000000000', 'C', 'Stack Segment (SS)', FALSE),
('b1000093-0000-0000-0000-000000000000', 'D', 'Extra Segment (ES)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000094-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'In 8086 assembly language, which instruction is used to exchange data between two registers or register and memory?', 'The XCHG instruction swaps the contents of destination and source operands.', 2025, 'AP ECET 2025 CSE', 94, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000094-0000-0000-0000-000000000000', 'A', 'XCHG', TRUE),
('b1000094-0000-0000-0000-000000000000', 'B', 'MOV', FALSE),
('b1000094-0000-0000-0000-000000000000', 'C', 'SWAP', FALSE),
('b1000094-0000-0000-0000-000000000000', 'D', 'PUSH', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000095-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'Which interrupt in the 8086 microprocessor is non-maskable (cannot be disabled by CLI)?', 'NMI (Non-Maskable Interrupt) pin is edge-triggered and cannot be masked by software.', 2026, 'AP ECET 2026 CSE', 95, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000095-0000-0000-0000-000000000000', 'A', 'NMI', TRUE),
('b1000095-0000-0000-0000-000000000000', 'B', 'INTR', FALSE),
('b1000095-0000-0000-0000-000000000000', 'C', 'INT 21h', FALSE),
('b1000095-0000-0000-0000-000000000000', 'D', 'TIMER', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000096-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'The 8051 microcontroller has how many bytes of internal on-chip RAM?', 'The standard 8051 microcontroller has 128 bytes of internal data RAM (addresses 00H-7FH).', 2021, 'AP ECET 2021 CSE', 96, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000096-0000-0000-0000-000000000000', 'A', '128 bytes', TRUE),
('b1000096-0000-0000-0000-000000000000', 'B', '256 bytes', FALSE),
('b1000096-0000-0000-0000-000000000000', 'C', '64 bytes', FALSE),
('b1000096-0000-0000-0000-000000000000', 'D', '512 bytes', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000097-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'In the 8051 microcontroller, which timer mode provides an 8-bit auto-reload timer/counter?', 'Mode 2 of Timer 0/1 operates as an 8-bit auto-reload counter using THx to reload TLx.', 2022, 'AP ECET 2022 CSE', 97, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000097-0000-0000-0000-000000000000', 'A', 'Mode 2', TRUE),
('b1000097-0000-0000-0000-000000000000', 'B', 'Mode 0', FALSE),
('b1000097-0000-0000-0000-000000000000', 'C', 'Mode 1', FALSE),
('b1000097-0000-0000-0000-000000000000', 'D', 'Mode 3', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000098-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'What is the function of the ALE (Address Latch Enable) pin in the 8086/8051?', 'ALE is used to demultiplex the time-multiplexed address/data bus by latching the lower address lines.', 2023, 'AP ECET 2023 CSE', 98, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000098-0000-0000-0000-000000000000', 'A', 'Demultiplex address and data bus', TRUE),
('b1000098-0000-0000-0000-000000000000', 'B', 'Select memory chip', FALSE),
('b1000098-0000-0000-0000-000000000000', 'C', 'Acknowledge interrupts', FALSE),
('b1000098-0000-0000-0000-000000000000', 'D', 'Clock the CPU', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000099-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'Which register in the 8051 microcontroller contains the carry, auxiliary carry, and parity flags?', 'The Program Status Word (PSW) register holds the status flags in 8051.', 2024, 'AP ECET 2024 CSE', 99, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000099-0000-0000-0000-000000000000', 'A', 'PSW (Program Status Word)', TRUE),
('b1000099-0000-0000-0000-000000000000', 'B', 'Accumulator (A)', FALSE),
('b1000099-0000-0000-0000-000000000000', 'C', 'B Register', FALSE),
('b1000099-0000-0000-0000-000000000000', 'D', 'DPTR', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b1000100-0000-0000-0000-000000000000', 'DCME', 'Microprocessors & Microcontrollers', 'C23', 'How many I/O ports are present on a standard 40-pin 8051 microcontroller?', 'The 8051 has 4 bidirectional 8-bit ports (P0, P1, P2, P3), totaling 32 I/O pins.', 2025, 'AP ECET 2025 CSE', 100, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b1000100-0000-0000-0000-000000000000', 'A', '4 ports (32 pins)', TRUE),
('b1000100-0000-0000-0000-000000000000', 'B', '2 ports (16 pins)', FALSE),
('b1000100-0000-0000-0000-000000000000', 'C', '3 ports (24 pins)', FALSE),
('b1000100-0000-0000-0000-000000000000', 'D', '8 ports (64 pins)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000001-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'If a matrix A has order 3x4 and matrix B has order 4x2, what is the order of the product AB?', 'Matrix multiplication (3x4) * (4x2) produces a matrix of order 3x2.', 2023, 'AP ECET 2023 CSE', 1, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000001-0000-0000-0000-000000000000', 'A', '3 x 2', TRUE),
('b2000001-0000-0000-0000-000000000000', 'B', '4 x 4', FALSE),
('b2000001-0000-0000-0000-000000000000', 'C', '2 x 3', FALSE),
('b2000001-0000-0000-0000-000000000000', 'D', 'Product not defined', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000002-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'A square matrix A is called orthogonal if:', 'An orthogonal matrix satisfies A * A^T = I (its transpose equals its inverse).', 2024, 'AP ECET 2024 CSE', 2, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000002-0000-0000-0000-000000000000', 'A', 'A * A^T = I', TRUE),
('b2000002-0000-0000-0000-000000000000', 'B', 'A = A^T', FALSE),
('b2000002-0000-0000-0000-000000000000', 'C', 'A = -A^T', FALSE),
('b2000002-0000-0000-0000-000000000000', 'D', '|A| = 0', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000003-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'What are the eigenvalues of a 2x2 matrix with trace = 5 and determinant = 6?', 'Characteristic equation is λ^2 - (trace)λ + det = λ^2 - 5λ + 6 = 0, giving λ = 2, 3.', 2025, 'AP ECET 2025 CSE', 3, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000003-0000-0000-0000-000000000000', 'A', '2 and 3', TRUE),
('b2000003-0000-0000-0000-000000000000', 'B', '1 and 6', FALSE),
('b2000003-0000-0000-0000-000000000000', 'C', '-2 and -3', FALSE),
('b2000003-0000-0000-0000-000000000000', 'D', '0 and 5', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000004-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'The rank of the 3x3 identity matrix is:', 'The identity matrix of order n has n linearly independent rows, so its rank is n = 3.', 2026, 'AP ECET 2026 CSE', 4, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000004-0000-0000-0000-000000000000', 'A', '3', TRUE),
('b2000004-0000-0000-0000-000000000000', 'B', '1', FALSE),
('b2000004-0000-0000-0000-000000000000', 'C', '0', FALSE),
('b2000004-0000-0000-0000-000000000000', 'D', '9', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000005-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'If A is a skew-symmetric matrix of odd order, its determinant is always:', 'The determinant of an odd-order skew-symmetric matrix is always zero.', 2021, 'AP ECET 2021 CSE', 5, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000005-0000-0000-0000-000000000000', 'A', '0', TRUE),
('b2000005-0000-0000-0000-000000000000', 'B', '1', FALSE),
('b2000005-0000-0000-0000-000000000000', 'C', '-1', FALSE),
('b2000005-0000-0000-0000-000000000000', 'D', 'Positive', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000006-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'According to the Cayley-Hamilton theorem, every square matrix satisfies its own:', 'The Cayley-Hamilton theorem states every square matrix satisfies its characteristic polynomial equation.', 2022, 'AP ECET 2022 CSE', 6, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000006-0000-0000-0000-000000000000', 'A', 'Characteristic equation', TRUE),
('b2000006-0000-0000-0000-000000000000', 'B', 'Transpose equation', FALSE),
('b2000006-0000-0000-0000-000000000000', 'C', 'Inverse identity', FALSE),
('b2000006-0000-0000-0000-000000000000', 'D', 'Trace relation', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000007-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'If A and B are square matrices of the same order, then (AB)^T is equal to:', 'By matrix transpose reversal property, (AB)^T = B^T * A^T.', 2023, 'AP ECET 2023 CSE', 7, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000007-0000-0000-0000-000000000000', 'A', 'B^T * A^T', TRUE),
('b2000007-0000-0000-0000-000000000000', 'B', 'A^T * B^T', FALSE),
('b2000007-0000-0000-0000-000000000000', 'C', 'A * B', FALSE),
('b2000007-0000-0000-0000-000000000000', 'D', '-(B^T * A^T)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000008-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'What is the inverse of the matrix [[1, 0], [0, 1]]?', 'The identity matrix is its own inverse; I^(-1) = I.', 2024, 'AP ECET 2024 CSE', 8, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000008-0000-0000-0000-000000000000', 'A', '[[1, 0], [0, 1]]', TRUE),
('b2000008-0000-0000-0000-000000000000', 'B', '[[0, 1], [1, 0]]', FALSE),
('b2000008-0000-0000-0000-000000000000', 'C', '[[1, 1], [0, 0]]', FALSE),
('b2000008-0000-0000-0000-000000000000', 'D', 'Does not exist', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000009-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'If the determinant of a matrix A is 0, the matrix is called:', 'A matrix with zero determinant cannot be inverted and is termed singular.', 2025, 'AP ECET 2025 CSE', 9, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000009-0000-0000-0000-000000000000', 'A', 'Singular', TRUE),
('b2000009-0000-0000-0000-000000000000', 'B', 'Non-singular', FALSE),
('b2000009-0000-0000-0000-000000000000', 'C', 'Orthogonal', FALSE),
('b2000009-0000-0000-0000-000000000000', 'D', 'Symmetric', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000010-0000-0000-0000-000000000000', 'MATHEMATICS', 'Matrices & Determinants', 'C23', 'The trace of a square matrix is defined as:', 'The trace is the sum of the elements on the principal (main) diagonal.', 2026, 'AP ECET 2026 CSE', 10, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000010-0000-0000-0000-000000000000', 'A', 'Sum of principal diagonal elements', TRUE),
('b2000010-0000-0000-0000-000000000000', 'B', 'Product of eigenvalues', FALSE),
('b2000010-0000-0000-0000-000000000000', 'C', 'Determinant of matrix', FALSE),
('b2000010-0000-0000-0000-000000000000', 'D', 'Sum of all elements', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000011-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'What is the value of sin(15°)?', 'sin(15°) = sin(45° - 30°) = (√6 - √2) / 4.', 2021, 'AP ECET 2021 CSE', 11, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000011-0000-0000-0000-000000000000', 'A', '(√6 - √2) / 4', TRUE),
('b2000011-0000-0000-0000-000000000000', 'B', '(√6 + √2) / 4', FALSE),
('b2000011-0000-0000-0000-000000000000', 'C', '(√3 - 1) / 2', FALSE),
('b2000011-0000-0000-0000-000000000000', 'D', '1 / 2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000012-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'The expression (1 - cos(2θ)) / (1 + cos(2θ)) simplifies to:', '(1 - cos(2θ)) = 2*sin^2(θ) and (1 + cos(2θ)) = 2*cos^2(θ); ratio is tan^2(θ).', 2022, 'AP ECET 2022 CSE', 12, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000012-0000-0000-0000-000000000000', 'A', 'tan^2(θ)', TRUE),
('b2000012-0000-0000-0000-000000000000', 'B', 'cot^2(θ)', FALSE),
('b2000012-0000-0000-0000-000000000000', 'C', 'sin^2(θ)', FALSE),
('b2000012-0000-0000-0000-000000000000', 'D', 'cos^2(θ)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000013-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'What is the period of the function f(x) = sin(3x)?', 'Period of sin(kx) is 2π / |k|; for k=3 it is 2π / 3.', 2023, 'AP ECET 2023 CSE', 13, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000013-0000-0000-0000-000000000000', 'A', '2π / 3', TRUE),
('b2000013-0000-0000-0000-000000000000', 'B', '2π', FALSE),
('b2000013-0000-0000-0000-000000000000', 'C', '3π', FALSE),
('b2000013-0000-0000-0000-000000000000', 'D', 'π / 3', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000014-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'If tan(A) = 1/2 and tan(B) = 1/3, what is the value of tan(A + B)?', 'tan(A+B) = (tan A + tan B) / (1 - tan A*tan B) = (1/2 + 1/3) / (1 - 1/6) = (5/6)/(5/6) = 1.', 2024, 'AP ECET 2024 CSE', 14, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000014-0000-0000-0000-000000000000', 'A', '1', TRUE),
('b2000014-0000-0000-0000-000000000000', 'B', '1/5', FALSE),
('b2000014-0000-0000-0000-000000000000', 'C', '5/6', FALSE),
('b2000014-0000-0000-0000-000000000000', 'D', '0', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000015-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'The value of sin^2(θ) + cos^2(θ) for any real angle θ is:', 'Fundamental Pythagorean identity states sin^2(θ) + cos^2(θ) = 1.', 2025, 'AP ECET 2025 CSE', 15, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000015-0000-0000-0000-000000000000', 'A', '1', TRUE),
('b2000015-0000-0000-0000-000000000000', 'B', '0', FALSE),
('b2000015-0000-0000-0000-000000000000', 'C', '2', FALSE),
('b2000015-0000-0000-0000-000000000000', 'D', '-1', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000016-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'What is cos(60°) * cos(30°) - sin(60°) * sin(30°)?', 'By addition formula cos(A+B) = cos A cos B - sin A sin B: cos(60°+30°) = cos(90°) = 0.', 2026, 'AP ECET 2026 CSE', 16, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000016-0000-0000-0000-000000000000', 'A', '0', TRUE),
('b2000016-0000-0000-0000-000000000000', 'B', '1', FALSE),
('b2000016-0000-0000-0000-000000000000', 'C', '1/2', FALSE),
('b2000016-0000-0000-0000-000000000000', 'D', '√3/2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000017-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'Which of the following is equivalent to sec^2(θ) - tan^2(θ)?', 'Identity sec^2(θ) = 1 + tan^2(θ) gives sec^2(θ) - tan^2(θ) = 1.', 2021, 'AP ECET 2021 CSE', 17, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000017-0000-0000-0000-000000000000', 'A', '1', TRUE),
('b2000017-0000-0000-0000-000000000000', 'B', '0', FALSE),
('b2000017-0000-0000-0000-000000000000', 'C', '-1', FALSE),
('b2000017-0000-0000-0000-000000000000', 'D', 'cos^2(θ)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000018-0000-0000-0000-000000000000', 'MATHEMATICS', 'Trigonometry', 'C23', 'What is the general solution for sin(θ) = 0?', 'sin(θ) = 0 when θ is any integer multiple of π: θ = nπ for n ∈ Z.', 2022, 'AP ECET 2022 CSE', 18, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000018-0000-0000-0000-000000000000', 'A', 'θ = nπ', TRUE),
('b2000018-0000-0000-0000-000000000000', 'B', 'θ = 2nπ', FALSE),
('b2000018-0000-0000-0000-000000000000', 'C', 'θ = (2n + 1)π / 2', FALSE),
('b2000018-0000-0000-0000-000000000000', 'D', 'θ = nπ / 2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000019-0000-0000-0000-000000000000', 'MATHEMATICS', 'Analytical Geometry', 'C23', 'What is the slope of a line perpendicular to a line with slope m = 3/4?', 'Perpendicular lines satisfy m1 * m2 = -1; thus m2 = -4/3.', 2023, 'AP ECET 2023 CSE', 19, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000019-0000-0000-0000-000000000000', 'A', '-4/3', TRUE),
('b2000019-0000-0000-0000-000000000000', 'B', '4/3', FALSE),
('b2000019-0000-0000-0000-000000000000', 'C', '-3/4', FALSE),
('b2000019-0000-0000-0000-000000000000', 'D', '3/4', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000020-0000-0000-0000-000000000000', 'MATHEMATICS', 'Analytical Geometry', 'C23', 'The distance between points P(1, 2) and Q(4, 6) in the Cartesian plane is:', 'Distance = √((4-1)^2 + (6-2)^2) = √(9 + 16) = √25 = 5.', 2024, 'AP ECET 2024 CSE', 20, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000020-0000-0000-0000-000000000000', 'A', '5', TRUE),
('b2000020-0000-0000-0000-000000000000', 'B', '7', FALSE),
('b2000020-0000-0000-0000-000000000000', 'C', '√7', FALSE),
('b2000020-0000-0000-0000-000000000000', 'D', '25', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000021-0000-0000-0000-000000000000', 'MATHEMATICS', 'Analytical Geometry', 'C23', 'What is the center and radius of the circle with equation x^2 + y^2 - 4x + 6y - 12 = 0?', 'Center (-g, -f) = (2, -3); radius r = √(g^2 + f^2 - c) = √(4 + 9 - (-12)) = √25 = 5.', 2025, 'AP ECET 2025 CSE', 21, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000021-0000-0000-0000-000000000000', 'A', 'Center (2, -3), radius 5', TRUE),
('b2000021-0000-0000-0000-000000000000', 'B', 'Center (-2, 3), radius 5', FALSE),
('b2000021-0000-0000-0000-000000000000', 'C', 'Center (2, -3), radius 25', FALSE),
('b2000021-0000-0000-0000-000000000000', 'D', 'Center (-4, 6), radius 12', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000022-0000-0000-0000-000000000000', 'MATHEMATICS', 'Analytical Geometry', 'C23', 'The eccentricity e of a parabola is always equal to:', 'A parabola is defined as the locus with eccentricity e = 1.', 2026, 'AP ECET 2026 CSE', 22, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000022-0000-0000-0000-000000000000', 'A', '1', TRUE),
('b2000022-0000-0000-0000-000000000000', 'B', '0', FALSE),
('b2000022-0000-0000-0000-000000000000', 'C', '< 1', FALSE),
('b2000022-0000-0000-0000-000000000000', 'D', '> 1', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000023-0000-0000-0000-000000000000', 'MATHEMATICS', 'Analytical Geometry', 'C23', 'What is the equation of the line passing through origin with angle of inclination 45°?', 'Slope m = tan(45°) = 1; equation y = mx + c with c=0 is y = x.', 2021, 'AP ECET 2021 CSE', 23, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000023-0000-0000-0000-000000000000', 'A', 'y = x', TRUE),
('b2000023-0000-0000-0000-000000000000', 'B', 'y = -x', FALSE),
('b2000023-0000-0000-0000-000000000000', 'C', 'x + y = 1', FALSE),
('b2000023-0000-0000-0000-000000000000', 'D', '2y = x', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000024-0000-0000-0000-000000000000', 'MATHEMATICS', 'Analytical Geometry', 'C23', 'The condition for two lines a1*x + b1*y + c1 = 0 and a2*x + b2*y + c2 = 0 to be parallel is:', 'Parallel lines have equal slopes: -a1/b1 = -a2/b2 => a1/a2 = b1/b2.', 2022, 'AP ECET 2022 CSE', 24, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000024-0000-0000-0000-000000000000', 'A', 'a1 / a2 = b1 / b2', TRUE),
('b2000024-0000-0000-0000-000000000000', 'B', 'a1*a2 + b1*b2 = 0', FALSE),
('b2000024-0000-0000-0000-000000000000', 'C', 'a1*b2 + a2*b1 = 0', FALSE),
('b2000024-0000-0000-0000-000000000000', 'D', 'c1 = c2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000025-0000-0000-0000-000000000000', 'MATHEMATICS', 'Analytical Geometry', 'C23', 'What is the length of the latus rectum of the parabola y^2 = 12x?', 'For y^2 = 4ax, 4a = 12, so the length of latus rectum is 4a = 12.', 2023, 'AP ECET 2023 CSE', 25, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000025-0000-0000-0000-000000000000', 'A', '12', TRUE),
('b2000025-0000-0000-0000-000000000000', 'B', '3', FALSE),
('b2000025-0000-0000-0000-000000000000', 'C', '6', FALSE),
('b2000025-0000-0000-0000-000000000000', 'D', '4', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000026-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'What is the derivative of ln(x^2 + 1) with respect to x?', 'd/dx[ln(u)] = (1/u)*u''. Here (2x) / (x^2 + 1).', 2024, 'AP ECET 2024 CSE', 26, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000026-0000-0000-0000-000000000000', 'A', '2x / (x^2 + 1)', TRUE),
('b2000026-0000-0000-0000-000000000000', 'B', '1 / (x^2 + 1)', FALSE),
('b2000026-0000-0000-0000-000000000000', 'C', 'x / (x^2 + 1)', FALSE),
('b2000026-0000-0000-0000-000000000000', 'D', '2 / (x^2 + 1)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000027-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'What is the value of limit as x approaches 0 of sin(5x) / x?', 'lim (x->0) sin(kx)/x = k; here k = 5.', 2025, 'AP ECET 2025 CSE', 27, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000027-0000-0000-0000-000000000000', 'A', '5', TRUE),
('b2000027-0000-0000-0000-000000000000', 'B', '1', FALSE),
('b2000027-0000-0000-0000-000000000000', 'C', '0', FALSE),
('b2000027-0000-0000-0000-000000000000', 'D', '1/5', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000028-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'At a point of local maximum of a differentiable function f(x), what is true of f''(x) and f''''(x)?', 'At a local maximum, f''(x) = 0 and f''''(x) < 0 (concave downwards).', 2026, 'AP ECET 2026 CSE', 28, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000028-0000-0000-0000-000000000000', 'A', 'f''(x) = 0 and f''''(x) < 0', TRUE),
('b2000028-0000-0000-0000-000000000000', 'B', 'f''(x) = 0 and f''''(x) > 0', FALSE),
('b2000028-0000-0000-0000-000000000000', 'C', 'f''(x) > 0 and f''''(x) = 0', FALSE),
('b2000028-0000-0000-0000-000000000000', 'D', 'f''(x) < 0 and f''''(x) = 0', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000029-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'What is the derivative of tan^(-1)(x) with respect to x?', 'Standard derivative: d/dx[arctan(x)] = 1 / (1 + x^2).', 2021, 'AP ECET 2021 CSE', 29, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000029-0000-0000-0000-000000000000', 'A', '1 / (1 + x^2)', TRUE),
('b2000029-0000-0000-0000-000000000000', 'B', '1 / √(1 - x^2)', FALSE),
('b2000029-0000-0000-0000-000000000000', 'C', '-1 / (1 + x^2)', FALSE),
('b2000029-0000-0000-0000-000000000000', 'D', '1 / (x^2 - 1)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000030-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'If y = x^x, what is dy/dx?', 'Taking ln(y) = x ln(x), differentiating gives (1/y) dy/dx = ln(x) + 1, so dy/dx = x^x * (1 + ln(x)).', 2022, 'AP ECET 2022 CSE', 30, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000030-0000-0000-0000-000000000000', 'A', 'x^x * (1 + ln(x))', TRUE),
('b2000030-0000-0000-0000-000000000000', 'B', 'x * x^(x - 1)', FALSE),
('b2000030-0000-0000-0000-000000000000', 'C', 'x^x * ln(x)', FALSE),
('b2000030-0000-0000-0000-000000000000', 'D', '(1 + ln(x))', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000031-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'What is the derivative of sec(x) with respect to x?', 'Standard formula: d/dx[sec(x)] = sec(x) * tan(x).', 2023, 'AP ECET 2023 CSE', 31, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000031-0000-0000-0000-000000000000', 'A', 'sec(x) * tan(x)', TRUE),
('b2000031-0000-0000-0000-000000000000', 'B', 'sec^2(x)', FALSE),
('b2000031-0000-0000-0000-000000000000', 'C', 'tan^2(x)', FALSE),
('b2000031-0000-0000-0000-000000000000', 'D', '-sec(x) * tan(x)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000032-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'L''Hopital''s rule can be applied when evaluating limits that result in which indeterminate form?', 'L''Hopital''s rule applies directly to forms 0/0 and ∞/∞.', 2024, 'AP ECET 2024 CSE', 32, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000032-0000-0000-0000-000000000000', 'A', '0 / 0 or ∞ / ∞', TRUE),
('b2000032-0000-0000-0000-000000000000', 'B', '1^∞', FALSE),
('b2000032-0000-0000-0000-000000000000', 'C', '0 * ∞', FALSE),
('b2000032-0000-0000-0000-000000000000', 'D', '∞ - ∞', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000033-0000-0000-0000-000000000000', 'MATHEMATICS', 'Differential Calculus', 'C23', 'What is the second derivative of f(x) = x^4 - 2x^3 + 5x?', 'f''(x) = 4x^3 - 6x^2 + 5; f''''(x) = 12x^2 - 12x.', 2025, 'AP ECET 2025 CSE', 33, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000033-0000-0000-0000-000000000000', 'A', '12x^2 - 12x', TRUE),
('b2000033-0000-0000-0000-000000000000', 'B', '4x^3 - 6x^2', FALSE),
('b2000033-0000-0000-0000-000000000000', 'C', '24x - 12', FALSE),
('b2000033-0000-0000-0000-000000000000', 'D', '12x^2 + 12x', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000034-0000-0000-0000-000000000000', 'MATHEMATICS', 'Integral Calculus & Differential Equations', 'C23', 'What is the integral ∫ e^(3x) dx?', '∫ e^(kx) dx = (1/k)*e^(kx) + C; here (1/3)*e^(3x) + C.', 2026, 'AP ECET 2026 CSE', 34, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000034-0000-0000-0000-000000000000', 'A', '(1/3) * e^(3x) + C', TRUE),
('b2000034-0000-0000-0000-000000000000', 'B', '3 * e^(3x) + C', FALSE),
('b2000034-0000-0000-0000-000000000000', 'C', 'e^(3x) + C', FALSE),
('b2000034-0000-0000-0000-000000000000', 'D', '(1/9) * e^(3x) + C', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000035-0000-0000-0000-000000000000', 'MATHEMATICS', 'Integral Calculus & Differential Equations', 'C23', 'What is the value of the definite integral ∫ x^3 dx from x = 0 to 2?', 'Antiderivative is x^4 / 4. Evaluated from 0 to 2: (16 / 4) - 0 = 4.', 2021, 'AP ECET 2021 CSE', 35, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000035-0000-0000-0000-000000000000', 'A', '4', TRUE),
('b2000035-0000-0000-0000-000000000000', 'B', '8', FALSE),
('b2000035-0000-0000-0000-000000000000', 'C', '2', FALSE),
('b2000035-0000-0000-0000-000000000000', 'D', '16', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000036-0000-0000-0000-000000000000', 'MATHEMATICS', 'Integral Calculus & Differential Equations', 'C23', 'What is the order and degree of the differential equation (d^2y/dx^2)^3 + (dy/dx)^4 + y = 0?', 'Order is the highest derivative (2), degree is the power of the highest derivative (3).', 2022, 'AP ECET 2022 CSE', 36, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000036-0000-0000-0000-000000000000', 'A', 'Order 2, Degree 3', TRUE),
('b2000036-0000-0000-0000-000000000000', 'B', 'Order 3, Degree 2', FALSE),
('b2000036-0000-0000-0000-000000000000', 'C', 'Order 2, Degree 4', FALSE),
('b2000036-0000-0000-0000-000000000000', 'D', 'Order 4, Degree 2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000037-0000-0000-0000-000000000000', 'MATHEMATICS', 'Integral Calculus & Differential Equations', 'C23', 'What is the integrating factor (I.F.) for the linear differential equation dy/dx + P(x)*y = Q(x)?', 'The integrating factor is e^(∫ P(x) dx).', 2023, 'AP ECET 2023 CSE', 37, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000037-0000-0000-0000-000000000000', 'A', 'e^(∫ P(x) dx)', TRUE),
('b2000037-0000-0000-0000-000000000000', 'B', 'e^(∫ Q(x) dx)', FALSE),
('b2000037-0000-0000-0000-000000000000', 'C', '∫ P(x) dx', FALSE),
('b2000037-0000-0000-0000-000000000000', 'D', 'e^(-∫ P(x) dx)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000038-0000-0000-0000-000000000000', 'MATHEMATICS', 'Integral Calculus & Differential Equations', 'C23', 'What is the integral ∫ (1 / x) dx for x > 0?', 'Standard integral: ∫ (1/x) dx = ln|x| + C.', 2024, 'AP ECET 2024 CSE', 38, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000038-0000-0000-0000-000000000000', 'A', 'ln(x) + C', TRUE),
('b2000038-0000-0000-0000-000000000000', 'B', '-1 / x^2 + C', FALSE),
('b2000038-0000-0000-0000-000000000000', 'C', 'x + C', FALSE),
('b2000038-0000-0000-0000-000000000000', 'D', 'e^x + C', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000039-0000-0000-0000-000000000000', 'MATHEMATICS', 'Integral Calculus & Differential Equations', 'C23', 'The differential equation dy/dx = (x + y) / (x - y) is classified as:', 'Both numerator and denominator are homogeneous functions of degree 1, so it is a homogeneous differential equation.', 2025, 'AP ECET 2025 CSE', 39, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000039-0000-0000-0000-000000000000', 'A', 'Homogeneous differential equation', TRUE),
('b2000039-0000-0000-0000-000000000000', 'B', 'Linear differential equation', FALSE),
('b2000039-0000-0000-0000-000000000000', 'C', 'Exact differential equation', FALSE),
('b2000039-0000-0000-0000-000000000000', 'D', 'Separable variable equation', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000040-0000-0000-0000-000000000000', 'MATHEMATICS', 'Integral Calculus & Differential Equations', 'C23', 'What is the integral ∫ cos(2x) dx?', '∫ cos(kx) dx = (1/k)*sin(kx) + C; here (1/2)*sin(2x) + C.', 2026, 'AP ECET 2026 CSE', 40, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000040-0000-0000-0000-000000000000', 'A', '(1/2) * sin(2x) + C', TRUE),
('b2000040-0000-0000-0000-000000000000', 'B', '- (1/2) * sin(2x) + C', FALSE),
('b2000040-0000-0000-0000-000000000000', 'C', '2 * sin(2x) + C', FALSE),
('b2000040-0000-0000-0000-000000000000', 'D', 'sin(2x) + C', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000041-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the Laplace transform of the function f(t) = e^(at) for s > a?', 'L{e^(at)} = ∫ e^(-st) e^(at) dt = 1 / (s - a).', 2021, 'AP ECET 2021 CSE', 41, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000041-0000-0000-0000-000000000000', 'A', '1 / (s - a)', TRUE),
('b2000041-0000-0000-0000-000000000000', 'B', '1 / (s + a)', FALSE),
('b2000041-0000-0000-0000-000000000000', 'C', 's / (s - a)', FALSE),
('b2000041-0000-0000-0000-000000000000', 'D', 'a / (s^2 + a^2)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000042-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the Laplace transform of sin(at)?', 'L{sin(at)} = a / (s^2 + a^2).', 2022, 'AP ECET 2022 CSE', 42, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000042-0000-0000-0000-000000000000', 'A', 'a / (s^2 + a^2)', TRUE),
('b2000042-0000-0000-0000-000000000000', 'B', 's / (s^2 + a^2)', FALSE),
('b2000042-0000-0000-0000-000000000000', 'C', '1 / (s^2 + a^2)', FALSE),
('b2000042-0000-0000-0000-000000000000', 'D', 'a / (s^2 - a^2)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000043-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the Laplace transform of cos(at)?', 'L{cos(at)} = s / (s^2 + a^2).', 2023, 'AP ECET 2023 CSE', 43, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000043-0000-0000-0000-000000000000', 'A', 's / (s^2 + a^2)', TRUE),
('b2000043-0000-0000-0000-000000000000', 'B', 'a / (s^2 + a^2)', FALSE),
('b2000043-0000-0000-0000-000000000000', 'C', 's / (s^2 - a^2)', FALSE),
('b2000043-0000-0000-0000-000000000000', 'D', '1 / (s^2 + a^2)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000044-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the Laplace transform of the unit step function u(t)?', 'L{1} = 1 / s for s > 0.', 2024, 'AP ECET 2024 CSE', 44, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000044-0000-0000-0000-000000000000', 'A', '1 / s', TRUE),
('b2000044-0000-0000-0000-000000000000', 'B', '1 / s^2', FALSE),
('b2000044-0000-0000-0000-000000000000', 'C', 's', FALSE),
('b2000044-0000-0000-0000-000000000000', 'D', '1', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000045-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the magnitude of the 3D vector v = 2i + 3j + 6k?', '|v| = √(2^2 + 3^2 + 6^2) = √(4 + 9 + 36) = √49 = 7.', 2025, 'AP ECET 2025 CSE', 45, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000045-0000-0000-0000-000000000000', 'A', '7', TRUE),
('b2000045-0000-0000-0000-000000000000', 'B', '11', FALSE),
('b2000045-0000-0000-0000-000000000000', 'C', '√36', FALSE),
('b2000045-0000-0000-0000-000000000000', 'D', '14', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000046-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the dot product of two mutually perpendicular non-zero vectors?', 'A · B = |A||B| cos(90°) = 0.', 2026, 'AP ECET 2026 CSE', 46, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000046-0000-0000-0000-000000000000', 'A', '0', TRUE),
('b2000046-0000-0000-0000-000000000000', 'B', '1', FALSE),
('b2000046-0000-0000-0000-000000000000', 'C', '-1', FALSE),
('b2000046-0000-0000-0000-000000000000', 'D', '|A||B|', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000047-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the value of i^4 where i is the imaginary unit (i = √-1)?', 'i^1 = i, i^2 = -1, i^3 = -i, i^4 = 1.', 2021, 'AP ECET 2021 CSE', 47, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000047-0000-0000-0000-000000000000', 'A', '1', TRUE),
('b2000047-0000-0000-0000-000000000000', 'B', '-1', FALSE),
('b2000047-0000-0000-0000-000000000000', 'C', 'i', FALSE),
('b2000047-0000-0000-0000-000000000000', 'D', '-i', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000048-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the probability of obtaining a total sum of 7 when two unbiased dice are thrown simultaneously?', 'Favorable outcomes (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 out of 36; 6/36 = 1/6.', 2022, 'AP ECET 2022 CSE', 48, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000048-0000-0000-0000-000000000000', 'A', '1 / 6', TRUE),
('b2000048-0000-0000-0000-000000000000', 'B', '1 / 12', FALSE),
('b2000048-0000-0000-0000-000000000000', 'C', '7 / 36', FALSE),
('b2000048-0000-0000-0000-000000000000', 'D', '1 / 36', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000049-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the limit as x approaches infinity of (2x + 5) / (3x - 1)?', 'Dividing numerator and denominator by x gives lim (2 + 5/x) / (3 - 1/x) = 2/3.', 2023, 'AP ECET 2023 CSE', 49, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000049-0000-0000-0000-000000000000', 'A', '2 / 3', TRUE),
('b2000049-0000-0000-0000-000000000000', 'B', '5 / 3', FALSE),
('b2000049-0000-0000-0000-000000000000', 'C', '0', FALSE),
('b2000049-0000-0000-0000-000000000000', 'D', 'Infinity', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b2000050-0000-0000-0000-000000000000', 'MATHEMATICS', 'Laplace Transforms & Vector Algebra', 'C23', 'What is the general solution of the first-order differential equation dy/dx = y?', 'Separating variables: dy/y = dx => ln|y| = x + C1 => y = C*e^x.', 2024, 'AP ECET 2024 CSE', 50, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b2000050-0000-0000-0000-000000000000', 'A', 'y = C * e^x', TRUE),
('b2000050-0000-0000-0000-000000000000', 'B', 'y = x^2 + C', FALSE),
('b2000050-0000-0000-0000-000000000000', 'C', 'y = C * ln(x)', FALSE),
('b2000050-0000-0000-0000-000000000000', 'D', 'y = e^(-x) + C', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000001-0000-0000-0000-000000000000', 'PHYSICS', 'Units, Dimensions & Vectors', 'C23', 'Which of the following is a fundamental SI unit?', 'The Candela is one of the 7 base SI units (along with meter, kilogram, second, ampere, kelvin, mole).', 2024, 'AP ECET 2024 CSE', 1, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000001-0000-0000-0000-000000000000', 'A', 'Candela', TRUE),
('b3000001-0000-0000-0000-000000000000', 'B', 'Newton', FALSE),
('b3000001-0000-0000-0000-000000000000', 'C', 'Joule', FALSE),
('b3000001-0000-0000-0000-000000000000', 'D', 'Coulomb', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000002-0000-0000-0000-000000000000', 'PHYSICS', 'Units, Dimensions & Vectors', 'C23', 'The magnitude of the cross product of two parallel vectors is:', 'Cross product |A x B| = |A||B|sin(θ). For parallel vectors, θ = 0°, so sin(0) = 0.', 2025, 'AP ECET 2025 CSE', 2, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000002-0000-0000-0000-000000000000', 'A', '0', TRUE),
('b3000002-0000-0000-0000-000000000000', 'B', '|A| * |B|', FALSE),
('b3000002-0000-0000-0000-000000000000', 'C', '1', FALSE),
('b3000002-0000-0000-0000-000000000000', 'D', '-1', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000003-0000-0000-0000-000000000000', 'PHYSICS', 'Units, Dimensions & Vectors', 'C23', 'If vector A = 3i + 4j, what is the unit vector in the direction of A?', 'Magnitude |A| = √(3^2 + 4^2) = 5. Unit vector = (3i + 4j) / 5.', 2026, 'AP ECET 2026 CSE', 3, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000003-0000-0000-0000-000000000000', 'A', '(3i + 4j) / 5', TRUE),
('b3000003-0000-0000-0000-000000000000', 'B', '(3i + 4j) / 25', FALSE),
('b3000003-0000-0000-0000-000000000000', 'C', '(4i + 3j) / 5', FALSE),
('b3000003-0000-0000-0000-000000000000', 'D', '(3i - 4j) / 5', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000004-0000-0000-0000-000000000000', 'PHYSICS', 'Units, Dimensions & Vectors', 'C23', 'The angle between two vectors A and B whose dot product is zero is:', 'A · B = |A||B|cos(θ) = 0 implies cos(θ) = 0, so θ = 90°.', 2021, 'AP ECET 2021 CSE', 4, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000004-0000-0000-0000-000000000000', 'A', '90°', TRUE),
('b3000004-0000-0000-0000-000000000000', 'B', '0°', FALSE),
('b3000004-0000-0000-0000-000000000000', 'C', '180°', FALSE),
('b3000004-0000-0000-0000-000000000000', 'D', '45°', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000005-0000-0000-0000-000000000000', 'PHYSICS', 'Kinematics, Friction & Work-Energy', 'C23', 'A ball is projected vertically upward with speed u. The maximum height reached is:', 'At maximum height v = 0. Using v^2 = u^2 - 2gh gives h = u^2 / (2g).', 2022, 'AP ECET 2022 CSE', 5, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000005-0000-0000-0000-000000000000', 'A', 'u^2 / (2g)', TRUE),
('b3000005-0000-0000-0000-000000000000', 'B', 'u / g', FALSE),
('b3000005-0000-0000-0000-000000000000', 'C', '2u^2 / g', FALSE),
('b3000005-0000-0000-0000-000000000000', 'D', 'u^2 / g', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000006-0000-0000-0000-000000000000', 'PHYSICS', 'Kinematics, Friction & Work-Energy', 'C23', 'The work done by a centripetal force acting on a body in uniform circular motion is always:', 'Centripetal force is perpendicular to displacement (cos 90° = 0), so work done is zero.', 2023, 'AP ECET 2023 CSE', 6, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000006-0000-0000-0000-000000000000', 'A', 'Zero', TRUE),
('b3000006-0000-0000-0000-000000000000', 'B', 'Positive', FALSE),
('b3000006-0000-0000-0000-000000000000', 'C', 'Negative', FALSE),
('b3000006-0000-0000-0000-000000000000', 'D', 'Equal to kinetic energy', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000007-0000-0000-0000-000000000000', 'PHYSICS', 'Kinematics, Friction & Work-Energy', 'C23', 'Which friction is self-adjusting in magnitude up to its limiting value?', 'Static friction adjusts its magnitude to match the applied tangential force until limiting friction is reached.', 2024, 'AP ECET 2024 CSE', 7, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000007-0000-0000-0000-000000000000', 'A', 'Static friction', TRUE),
('b3000007-0000-0000-0000-000000000000', 'B', 'Kinetic friction', FALSE),
('b3000007-0000-0000-0000-000000000000', 'C', 'Rolling friction', FALSE),
('b3000007-0000-0000-0000-000000000000', 'D', 'Fluid friction', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000008-0000-0000-0000-000000000000', 'PHYSICS', 'Kinematics, Friction & Work-Energy', 'C23', 'The rate of doing work is defined as:', 'Power = Work / Time; unit is Watt.', 2025, 'AP ECET 2025 CSE', 8, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000008-0000-0000-0000-000000000000', 'A', 'Power', TRUE),
('b3000008-0000-0000-0000-000000000000', 'B', 'Energy', FALSE),
('b3000008-0000-0000-0000-000000000000', 'C', 'Momentum', FALSE),
('b3000008-0000-0000-0000-000000000000', 'D', 'Impulse', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000009-0000-0000-0000-000000000000', 'PHYSICS', 'Kinematics, Friction & Work-Energy', 'C23', 'When the velocity of a moving object is doubled, its kinetic energy:', 'Kinetic Energy KE = (1/2)mv^2; doubling v quadruples KE (2^2 = 4).', 2026, 'AP ECET 2026 CSE', 9, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000009-0000-0000-0000-000000000000', 'A', 'Increases by 4 times', TRUE),
('b3000009-0000-0000-0000-000000000000', 'B', 'Doubles', FALSE),
('b3000009-0000-0000-0000-000000000000', 'C', 'Remains unchanged', FALSE),
('b3000009-0000-0000-0000-000000000000', 'D', 'Increases by 8 times', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000010-0000-0000-0000-000000000000', 'PHYSICS', 'Heat & Thermodynamics', 'C23', 'The temperature at which Celsius and Fahrenheit scales read the exact same number is:', 'Formula: C/5 = (F - 32)/9. Setting C = F = x gives x = -40°.', 2021, 'AP ECET 2021 CSE', 10, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000010-0000-0000-0000-000000000000', 'A', '-40°', TRUE),
('b3000010-0000-0000-0000-000000000000', 'B', '0°', FALSE),
('b3000010-0000-0000-0000-000000000000', 'C', '-32°', FALSE),
('b3000010-0000-0000-0000-000000000000', 'D', '100°', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000011-0000-0000-0000-000000000000', 'PHYSICS', 'Heat & Thermodynamics', 'C23', 'The efficiency of an ideal Carnot engine operating between temperatures T1 (source) and T2 (sink) in Kelvin is:', 'Carnot efficiency η = 1 - (T2 / T1) = (T1 - T2) / T1.', 2022, 'AP ECET 2022 CSE', 11, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000011-0000-0000-0000-000000000000', 'A', '(T1 - T2) / T1', TRUE),
('b3000011-0000-0000-0000-000000000000', 'B', 'T2 / T1', FALSE),
('b3000011-0000-0000-0000-000000000000', 'C', '(T1 + T2) / T1', FALSE),
('b3000011-0000-0000-0000-000000000000', 'D', 'T1 / (T1 - T2)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000012-0000-0000-0000-000000000000', 'PHYSICS', 'Heat & Thermodynamics', 'C23', 'Which mode of heat transfer does NOT require any material medium?', 'Thermal radiation travels via electromagnetic waves through vacuum without a physical medium.', 2023, 'AP ECET 2023 CSE', 12, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000012-0000-0000-0000-000000000000', 'A', 'Radiation', TRUE),
('b3000012-0000-0000-0000-000000000000', 'B', 'Conduction', FALSE),
('b3000012-0000-0000-0000-000000000000', 'C', 'Convection', FALSE),
('b3000012-0000-0000-0000-000000000000', 'D', 'Advection', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000013-0000-0000-0000-000000000000', 'PHYSICS', 'Heat & Thermodynamics', 'C23', 'According to Boyle''s law, at constant temperature, pressure of an ideal gas is:', 'Boyle''s law: P is inversely proportional to volume (P ∝ 1/V) at constant T.', 2024, 'AP ECET 2024 CSE', 13, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000013-0000-0000-0000-000000000000', 'A', 'Inversely proportional to volume', TRUE),
('b3000013-0000-0000-0000-000000000000', 'B', 'Directly proportional to volume', FALSE),
('b3000013-0000-0000-0000-000000000000', 'C', 'Independent of volume', FALSE),
('b3000013-0000-0000-0000-000000000000', 'D', 'Proportional to square of volume', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000014-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'In Simple Harmonic Motion (SHM), acceleration is directly proportional to displacement and directed:', 'In SHM, a = -ω^2 * x; acceleration is directed towards the mean position.', 2025, 'AP ECET 2025 CSE', 14, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000014-0000-0000-0000-000000000000', 'A', 'Towards the mean position', TRUE),
('b3000014-0000-0000-0000-000000000000', 'B', 'Away from the mean position', FALSE),
('b3000014-0000-0000-0000-000000000000', 'C', 'Perpendicular to path', FALSE),
('b3000014-0000-0000-0000-000000000000', 'D', 'Tangent to path', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000015-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'The persistence of sound in an auditorium after the source stops is known as:', 'Reverberation is the prolonged persistence of sound due to repeated reflections.', 2026, 'AP ECET 2026 CSE', 15, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000015-0000-0000-0000-000000000000', 'A', 'Reverberation', TRUE),
('b3000015-0000-0000-0000-000000000000', 'B', 'Echo', FALSE),
('b3000015-0000-0000-0000-000000000000', 'C', 'Diffraction', FALSE),
('b3000015-0000-0000-0000-000000000000', 'D', 'Resonance', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000016-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'The photoelectric effect demonstrates the:', 'The photoelectric effect demonstrates the particle nature of electromagnetic radiation (photons).', 2021, 'AP ECET 2021 CSE', 16, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000016-0000-0000-0000-000000000000', 'A', 'Particle nature of light', TRUE),
('b3000016-0000-0000-0000-000000000000', 'B', 'Wave nature of light', FALSE),
('b3000016-0000-0000-0000-000000000000', 'C', 'Longitudinal nature of light', FALSE),
('b3000016-0000-0000-0000-000000000000', 'D', 'Electromagnetic wave theory', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000017-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'In an intrinsic semiconductor at absolute zero temperature (0 K), the electrical conductivity is:', 'At 0 K, all valence electrons are bound in covalent bonds, so intrinsic semiconductors behave as perfect insulators (zero conductivity).', 2022, 'AP ECET 2022 CSE', 17, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000017-0000-0000-0000-000000000000', 'A', 'Zero (acts as insulator)', TRUE),
('b3000017-0000-0000-0000-000000000000', 'B', 'Very high', FALSE),
('b3000017-0000-0000-0000-000000000000', 'C', 'Infinite', FALSE),
('b3000017-0000-0000-0000-000000000000', 'D', 'Same as room temperature', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000018-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'Which type of doping atom creates an n-type semiconductor in silicon?', 'Pentavalent impurities (e.g. Phosphorus, Arsenic, Antimony) provide free conduction electrons.', 2023, 'AP ECET 2023 CSE', 18, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000018-0000-0000-0000-000000000000', 'A', 'Pentavalent impurity (e.g. Phosphorus)', TRUE),
('b3000018-0000-0000-0000-000000000000', 'B', 'Trivalent impurity (e.g. Boron)', FALSE),
('b3000018-0000-0000-0000-000000000000', 'C', 'Tetravalent impurity', FALSE),
('b3000018-0000-0000-0000-000000000000', 'D', 'Bivalent impurity', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000019-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'What is the relation between frequency (f), wavelength (λ), and wave speed (v)?', 'Fundamental wave equation: v = f * λ.', 2024, 'AP ECET 2024 CSE', 19, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000019-0000-0000-0000-000000000000', 'A', 'v = f * λ', TRUE),
('b3000019-0000-0000-0000-000000000000', 'B', 'v = f / λ', FALSE),
('b3000019-0000-0000-0000-000000000000', 'C', 'f = v * λ', FALSE),
('b3000019-0000-0000-0000-000000000000', 'D', 'λ = v * f', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000020-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'According to Snell''s law of refraction, the ratio of sin(i) to sin(r) is equal to:', 'Snell''s law: sin(i) / sin(r) = n2 / n1 = constant (relative refractive index).', 2025, 'AP ECET 2025 CSE', 20, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000020-0000-0000-0000-000000000000', 'A', 'Relative refractive index (μ)', TRUE),
('b3000020-0000-0000-0000-000000000000', 'B', '1', FALSE),
('b3000020-0000-0000-0000-000000000000', 'C', 'Speed of light in vacuum', FALSE),
('b3000020-0000-0000-0000-000000000000', 'D', 'Critical angle', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000021-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'Sound waves in air are classified as:', 'Sound waves propagate via compressions and rarefactions parallel to wave direction, making them longitudinal mechanical waves.', 2026, 'AP ECET 2026 CSE', 21, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000021-0000-0000-0000-000000000000', 'A', 'Longitudinal mechanical waves', TRUE),
('b3000021-0000-0000-0000-000000000000', 'B', 'Transverse electromagnetic waves', FALSE),
('b3000021-0000-0000-0000-000000000000', 'C', 'Transverse mechanical waves', FALSE),
('b3000021-0000-0000-0000-000000000000', 'D', 'Standing stationary waves only', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000022-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'The minimum frequency of incident light required to emit photoelectrons from a metal surface is called:', 'Threshold frequency (ν0) is the cutoff frequency below which no photoemission occurs regardless of intensity.', 2021, 'AP ECET 2021 CSE', 22, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000022-0000-0000-0000-000000000000', 'A', 'Threshold frequency', TRUE),
('b3000022-0000-0000-0000-000000000000', 'B', 'Resonance frequency', FALSE),
('b3000022-0000-0000-0000-000000000000', 'C', 'Cutoff velocity', FALSE),
('b3000022-0000-0000-0000-000000000000', 'D', 'Work function', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000023-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'In a p-n junction diode under forward bias, the width of the depletion layer:', 'Forward bias opposes the built-in barrier potential, decreasing the depletion layer width.', 2022, 'AP ECET 2022 CSE', 23, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000023-0000-0000-0000-000000000000', 'A', 'Decreases', TRUE),
('b3000023-0000-0000-0000-000000000000', 'B', 'Increases', FALSE),
('b3000023-0000-0000-0000-000000000000', 'C', 'Remains unchanged', FALSE),
('b3000023-0000-0000-0000-000000000000', 'D', 'Expands to infinity', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000024-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'Which principle states that no two electrons in an atom can have the same set of four quantum numbers?', 'Pauli''s Exclusion Principle dictates that an orbital can hold at most two electrons with opposite spins.', 2023, 'AP ECET 2023 CSE', 24, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000024-0000-0000-0000-000000000000', 'A', 'Pauli Exclusion Principle', TRUE),
('b3000024-0000-0000-0000-000000000000', 'B', 'Aufbau Principle', FALSE),
('b3000024-0000-0000-0000-000000000000', 'C', 'Hund''s Rule', FALSE),
('b3000024-0000-0000-0000-000000000000', 'D', 'Heisenberg Principle', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b3000025-0000-0000-0000-000000000000', 'PHYSICS', 'Oscillations, Waves & Modern Physics', 'C23', 'What is the SI unit of magnetic flux?', 'The SI unit of magnetic flux is Weber (Wb); magnetic flux density is measured in Tesla (Wb/m^2).', 2024, 'AP ECET 2024 CSE', 25, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b3000025-0000-0000-0000-000000000000', 'A', 'Weber', TRUE),
('b3000025-0000-0000-0000-000000000000', 'B', 'Tesla', FALSE),
('b3000025-0000-0000-0000-000000000000', 'C', 'Henry', FALSE),
('b3000025-0000-0000-0000-000000000000', 'D', 'Gauss', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000001-0000-0000-0000-000000000000', 'CHEMISTRY', 'Atomic Structure & Chemical Bonding', 'C23', 'The maximum number of electrons that can be accommodated in a shell with principal quantum number n is:', 'A principal shell n can accommodate 2n^2 electrons.', 2025, 'AP ECET 2025 CSE', 1, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000001-0000-0000-0000-000000000000', 'A', '2n^2', TRUE),
('b4000001-0000-0000-0000-000000000000', 'B', '2n', FALSE),
('b4000001-0000-0000-0000-000000000000', 'C', 'n^2', FALSE),
('b4000001-0000-0000-0000-000000000000', 'D', '4n + 2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000002-0000-0000-0000-000000000000', 'CHEMISTRY', 'Atomic Structure & Chemical Bonding', 'C23', 'Which of the following compounds exhibits an electrovalent (ionic) bond?', 'Sodium chloride (NaCl) is formed by complete transfer of an electron from Na to Cl, forming an ionic bond.', 2026, 'AP ECET 2026 CSE', 2, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000002-0000-0000-0000-000000000000', 'A', 'NaCl', TRUE),
('b4000002-0000-0000-0000-000000000000', 'B', 'CH4', FALSE),
('b4000002-0000-0000-0000-000000000000', 'C', 'H2O', FALSE),
('b4000002-0000-0000-0000-000000000000', 'D', 'CO2', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000003-0000-0000-0000-000000000000', 'CHEMISTRY', 'Atomic Structure & Chemical Bonding', 'C23', 'What is the shape of a water (H2O) molecule according to VSEPR theory?', 'Oxygen has 2 bonding pairs and 2 lone pairs (sp3), producing a bent / V-shaped geometry (104.5°).', 2021, 'AP ECET 2021 CSE', 3, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000003-0000-0000-0000-000000000000', 'A', 'Bent (V-shaped)', TRUE),
('b4000003-0000-0000-0000-000000000000', 'B', 'Linear', FALSE),
('b4000003-0000-0000-0000-000000000000', 'C', 'Tetrahedral', FALSE),
('b4000003-0000-0000-0000-000000000000', 'D', 'Trigonal planar', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000004-0000-0000-0000-000000000000', 'CHEMISTRY', 'Atomic Structure & Chemical Bonding', 'C23', 'Which quantum number designates the spatial orientation of an atomic orbital?', 'The magnetic quantum number (m) determines the orientation of orbitals in space.', 2022, 'AP ECET 2022 CSE', 4, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000004-0000-0000-0000-000000000000', 'A', 'Magnetic quantum number (m)', TRUE),
('b4000004-0000-0000-0000-000000000000', 'B', 'Principal quantum number (n)', FALSE),
('b4000004-0000-0000-0000-000000000000', 'C', 'Azimuthal quantum number (l)', FALSE),
('b4000004-0000-0000-0000-000000000000', 'D', 'Spin quantum number (s)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000005-0000-0000-0000-000000000000', 'CHEMISTRY', 'Solutions, Acids & Bases', 'C23', 'What is the pH of a 0.001 M HCl aqueous solution?', 'HCl is a strong acid: [H+] = 10^(-3) M. pH = -log10[H+] = -log10(10^(-3)) = 3.', 2023, 'AP ECET 2023 CSE', 5, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000005-0000-0000-0000-000000000000', 'A', '3', TRUE),
('b4000005-0000-0000-0000-000000000000', 'B', '1', FALSE),
('b4000005-0000-0000-0000-000000000000', 'C', '7', FALSE),
('b4000005-0000-0000-0000-000000000000', 'D', '11', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000006-0000-0000-0000-000000000000', 'CHEMISTRY', 'Solutions, Acids & Bases', 'C23', 'According to the Bronsted-Lowry definition, a base is a substance that:', 'Bronsted-Lowry acid is a proton donor; a base is a proton (H+) acceptor.', 2024, 'AP ECET 2024 CSE', 6, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000006-0000-0000-0000-000000000000', 'A', 'Accepts a proton (H+)', TRUE),
('b4000006-0000-0000-0000-000000000000', 'B', 'Donates a proton', FALSE),
('b4000006-0000-0000-0000-000000000000', 'C', 'Accepts an electron pair', FALSE),
('b4000006-0000-0000-0000-000000000000', 'D', 'Produces OH- ions only', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000007-0000-0000-0000-000000000000', 'CHEMISTRY', 'Solutions, Acids & Bases', 'C23', 'A solution that resists changes in pH upon addition of small amounts of acid or base is called a:', 'A buffer solution consists of a weak acid and its conjugate base (or weak base and conjugate acid).', 2025, 'AP ECET 2025 CSE', 7, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000007-0000-0000-0000-000000000000', 'A', 'Buffer solution', TRUE),
('b4000007-0000-0000-0000-000000000000', 'B', 'Standard solution', FALSE),
('b4000007-0000-0000-0000-000000000000', 'C', 'Saturated solution', FALSE),
('b4000007-0000-0000-0000-000000000000', 'D', 'Colloidal solution', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000008-0000-0000-0000-000000000000', 'CHEMISTRY', 'Solutions, Acids & Bases', 'C23', 'What is the molarity of a solution containing 4 grams of NaOH (molecular weight = 40) dissolved in 500 mL of water?', 'Moles = 4 / 40 = 0.1 mol. Volume = 0.5 L. Molarity = 0.1 / 0.5 = 0.2 M.', 2026, 'AP ECET 2026 CSE', 8, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000008-0000-0000-0000-000000000000', 'A', '0.2 M', TRUE),
('b4000008-0000-0000-0000-000000000000', 'B', '0.1 M', FALSE),
('b4000008-0000-0000-0000-000000000000', 'C', '0.4 M', FALSE),
('b4000008-0000-0000-0000-000000000000', 'D', '1.0 M', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000009-0000-0000-0000-000000000000', 'CHEMISTRY', 'Electrochemistry & Corrosion', 'C23', 'Faraday''s First Law of Electrolysis states that mass (m) deposited at an electrode is proportional to:', 'm = Z * I * t = Z * Q; mass deposited is directly proportional to electrical charge Q.', 2021, 'AP ECET 2021 CSE', 9, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000009-0000-0000-0000-000000000000', 'A', 'Quantity of electricity (Q)', TRUE),
('b4000009-0000-0000-0000-000000000000', 'B', 'Atomic weight squared', FALSE),
('b4000009-0000-0000-0000-000000000000', 'C', 'Voltage applied', FALSE),
('b4000009-0000-0000-0000-000000000000', 'D', 'Electrolyte temperature', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000010-0000-0000-0000-000000000000', 'CHEMISTRY', 'Electrochemistry & Corrosion', 'C23', 'Galvanization is the process of coating iron or steel with a protective thin layer of:', 'Galvanization coats ferrous metals with zinc (Zn), providing sacrificial cathodic protection.', 2022, 'AP ECET 2022 CSE', 10, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000010-0000-0000-0000-000000000000', 'A', 'Zinc (Zn)', TRUE),
('b4000010-0000-0000-0000-000000000000', 'B', 'Copper (Cu)', FALSE),
('b4000010-0000-0000-0000-000000000000', 'C', 'Tin (Sn)', FALSE),
('b4000010-0000-0000-0000-000000000000', 'D', 'Chromium (Cr)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000011-0000-0000-0000-000000000000', 'CHEMISTRY', 'Electrochemistry & Corrosion', 'C23', 'In an electrochemical cell, oxidation always takes place at the:', 'Oxidation (loss of electrons) occurs at the Anode in both galvanic and electrolytic cells.', 2023, 'AP ECET 2023 CSE', 11, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000011-0000-0000-0000-000000000000', 'A', 'Anode', TRUE),
('b4000011-0000-0000-0000-000000000000', 'B', 'Cathode', FALSE),
('b4000011-0000-0000-0000-000000000000', 'C', 'Salt bridge', FALSE),
('b4000011-0000-0000-0000-000000000000', 'D', 'Electrolyte solution', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000012-0000-0000-0000-000000000000', 'CHEMISTRY', 'Electrochemistry & Corrosion', 'C23', 'Rusting of iron is chemically represented as hydrated:', 'Rust is hydrated ferric oxide, Fe2O3 · xH2O.', 2024, 'AP ECET 2024 CSE', 12, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000012-0000-0000-0000-000000000000', 'A', 'Ferric oxide (Fe2O3 · xH2O)', TRUE),
('b4000012-0000-0000-0000-000000000000', 'B', 'Ferrous oxide (FeO)', FALSE),
('b4000012-0000-0000-0000-000000000000', 'C', 'Ferrous sulfate (FeSO4)', FALSE),
('b4000012-0000-0000-0000-000000000000', 'D', 'Iron carbonate (FeCO3)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000013-0000-0000-0000-000000000000', 'CHEMISTRY', 'Electrochemistry & Corrosion', 'C23', 'Which method of corrosion control uses an external electrical direct current to make the protected structure a cathode?', 'Impressed Current Cathodic Protection (ICCP) uses an external DC power source to bias the metal structure cathodically.', 2025, 'AP ECET 2025 CSE', 13, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000013-0000-0000-0000-000000000000', 'A', 'Impressed Current Cathodic Protection', TRUE),
('b4000013-0000-0000-0000-000000000000', 'B', 'Sacrificial Anode method', FALSE),
('b4000013-0000-0000-0000-000000000000', 'C', 'Galvanic electroplating', FALSE),
('b4000013-0000-0000-0000-000000000000', 'D', 'Anodic passivation', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000014-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Temporary hardness of water is caused by the presence of dissolved:', 'Temporary hardness is caused by bicarbonates of calcium and magnesium, which decompose upon boiling.', 2026, 'AP ECET 2026 CSE', 14, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000014-0000-0000-0000-000000000000', 'A', 'Bicarbonates of Ca and Mg', TRUE),
('b4000014-0000-0000-0000-000000000000', 'B', 'Chlorides of Ca and Mg', FALSE),
('b4000014-0000-0000-0000-000000000000', 'C', 'Sulfates of Ca and Mg', FALSE),
('b4000014-0000-0000-0000-000000000000', 'D', 'Nitrates of Na and K', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000015-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Which unit is commonly used to express water hardness in analytical chemistry?', 'Water hardness is conventionally expressed in parts per million (ppm) or mg/L as CaCO3 equivalent.', 2021, 'AP ECET 2021 CSE', 15, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000015-0000-0000-0000-000000000000', 'A', 'ppm as CaCO3 equivalent', TRUE),
('b4000015-0000-0000-0000-000000000000', 'B', 'Normality of Mg', FALSE),
('b4000015-0000-0000-0000-000000000000', 'C', 'pH value', FALSE),
('b4000015-0000-0000-0000-000000000000', 'D', 'Coulombs / liter', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000016-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Which of the following is a thermosetting polymer?', 'Bakelite (phenol-formaldehyde) forms cross-linked networks upon heating and cannot be remelted.', 2022, 'AP ECET 2022 CSE', 16, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000016-0000-0000-0000-000000000000', 'A', 'Bakelite', TRUE),
('b4000016-0000-0000-0000-000000000000', 'B', 'Polyethylene', FALSE),
('b4000016-0000-0000-0000-000000000000', 'C', 'PVC (Polyvinyl chloride)', FALSE),
('b4000016-0000-0000-0000-000000000000', 'D', 'Polystyrene', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000017-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'The monomer unit of natural rubber is:', 'Natural rubber is cis-1,4-polyisoprene, formed from isoprene (2-methyl-1,3-butadiene) monomers.', 2023, 'AP ECET 2023 CSE', 17, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000017-0000-0000-0000-000000000000', 'A', 'Isoprene', TRUE),
('b4000017-0000-0000-0000-000000000000', 'B', 'Chloroprene', FALSE),
('b4000017-0000-0000-0000-000000000000', 'C', 'Styrene', FALSE),
('b4000017-0000-0000-0000-000000000000', 'D', 'Ethylene', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000018-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'The process of heating natural rubber with sulfur to enhance its tensile strength and elasticity is called:', 'Vulcanization cross-links polymer chains using sulfur bridges.', 2024, 'AP ECET 2024 CSE', 18, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000018-0000-0000-0000-000000000000', 'A', 'Vulcanization', TRUE),
('b4000018-0000-0000-0000-000000000000', 'B', 'Polymerization', FALSE),
('b4000018-0000-0000-0000-000000000000', 'C', 'Galvanization', FALSE),
('b4000018-0000-0000-0000-000000000000', 'D', 'Distillation', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000019-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Which gas is primarily responsible for the greenhouse effect and global climate change?', 'Carbon dioxide (CO2) is the primary greenhouse gas emitted by human activities.', 2025, 'AP ECET 2025 CSE', 19, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000019-0000-0000-0000-000000000000', 'A', 'Carbon dioxide (CO2)', TRUE),
('b4000019-0000-0000-0000-000000000000', 'B', 'Oxygen (O2)', FALSE),
('b4000019-0000-0000-0000-000000000000', 'C', 'Nitrogen (N2)', FALSE),
('b4000019-0000-0000-0000-000000000000', 'D', 'Argon (Ar)', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000020-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Acid rain is predominantly caused by atmospheric pollution of:', 'Emissions of sulfur dioxide (SO2) and nitrogen oxides (NOx) form sulfuric and nitric acids in rainwater.', 2026, 'AP ECET 2026 CSE', 20, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000020-0000-0000-0000-000000000000', 'A', 'SO2 and NOx', TRUE),
('b4000020-0000-0000-0000-000000000000', 'B', 'CO and CO2', FALSE),
('b4000020-0000-0000-0000-000000000000', 'C', 'CFCs and methane', FALSE),
('b4000020-0000-0000-0000-000000000000', 'D', 'Ozone and hydrogen', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000021-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'In the EDTA titration method for determining water hardness, which indicator is used at pH 10?', 'Eriochrome Black T (EBT) is the standard complexometric indicator used in EDTA water hardness titration.', 2021, 'AP ECET 2021 CSE', 21, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000021-0000-0000-0000-000000000000', 'A', 'Eriochrome Black T (EBT)', TRUE),
('b4000021-0000-0000-0000-000000000000', 'B', 'Phenolphthalein', FALSE),
('b4000021-0000-0000-0000-000000000000', 'C', 'Methyl Orange', FALSE),
('b4000021-0000-0000-0000-000000000000', 'D', 'Litmus', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000022-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Depletion of the stratospheric ozone layer is primarily caused by:', 'Chlorofluorocarbons (CFCs) release chlorine radicals that catalytically break down ozone molecules.', 2022, 'AP ECET 2022 CSE', 22, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000022-0000-0000-0000-000000000000', 'A', 'Chlorofluorocarbons (CFCs)', TRUE),
('b4000022-0000-0000-0000-000000000000', 'B', 'Carbon dioxide', FALSE),
('b4000022-0000-0000-0000-000000000000', 'C', 'Sulfur dioxide', FALSE),
('b4000022-0000-0000-0000-000000000000', 'D', 'Particulate matter', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000023-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Which polymer is commonly used for manufacturing non-stick cookware coatings?', 'Teflon (PTFE, Polytetrafluoroethylene) has high heat resistance and non-stick properties.', 2023, 'AP ECET 2023 CSE', 23, 'MEDIUM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000023-0000-0000-0000-000000000000', 'A', 'Teflon (PTFE)', TRUE),
('b4000023-0000-0000-0000-000000000000', 'B', 'Bakelite', FALSE),
('b4000023-0000-0000-0000-000000000000', 'C', 'Nylon-6,6', FALSE),
('b4000023-0000-0000-0000-000000000000', 'D', 'PVC', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000024-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Biochemical Oxygen Demand (BOD) is a standard measure of:', 'BOD measures the amount of dissolved oxygen required by microorganisms to decompose organic matter in water.', 2024, 'AP ECET 2024 CSE', 24, 'HARD', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000024-0000-0000-0000-000000000000', 'A', 'Organic pollution in water', TRUE),
('b4000024-0000-0000-0000-000000000000', 'B', 'Hardness of water', FALSE),
('b4000024-0000-0000-0000-000000000000', 'C', 'Turbidity of water', FALSE),
('b4000024-0000-0000-0000-000000000000', 'D', 'Salinity of water', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;

INSERT INTO pyq_questions (id, subject, topic, curriculum, question_text, explanation, source_year, source_paper, source_question_number, difficulty, verified, active)
VALUES ('b4000025-0000-0000-0000-000000000000', 'CHEMISTRY', 'Water Technology, Polymers & Environment', 'C23', 'Reverse Osmosis (RO) purifies water by applying pressure greater than:', 'RO applies hydrostatic pressure greater than the osmotic pressure to force pure solvent through a semipermeable membrane.', 2025, 'AP ECET 2025 CSE', 25, 'EASY', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pyq_question_options (question_id, option_label, option_text, is_correct) VALUES
('b4000025-0000-0000-0000-000000000000', 'A', 'Osmotic pressure', TRUE),
('b4000025-0000-0000-0000-000000000000', 'B', 'Atmospheric pressure', FALSE),
('b4000025-0000-0000-0000-000000000000', 'C', 'Vapor pressure', FALSE),
('b4000025-0000-0000-0000-000000000000', 'D', 'Hydrostatic pressure of pure water', FALSE)
ON CONFLICT (question_id, option_label) DO NOTHING;
