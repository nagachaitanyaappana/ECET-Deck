package com.ecetdesk.api.practice;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class PracticeService {

    private final JdbcTemplate jdbc;

    public PracticeService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record ConceptInfo(String name, int questionCount) {}

    public record SubjectCatalog(
        String subject,
        String displayName,
        String stream,
        String code,
        int totalQuestions,
        List<ConceptInfo> concepts,
        List<ConceptInfo> topics // alias for backward-compatibility
    ) {}

    public record SubjectDefinition(
        String id,
        String displayName,
        String code,
        String stream,
        List<String> conceptNames,
        List<String> aliases
    ) {}

    public static final List<SubjectDefinition> C23_SUBJECTS = List.of(
        new SubjectDefinition(
            "OPERATING_SYSTEMS", "Operating Systems", "CM-303", "DCME",
            List.of(
                "Introduction to Operating System & Architecture",
                "Process Management & CPU Scheduling",
                "Synchronization & Deadlocks",
                "Memory Management & Virtual Memory",
                "Disk Scheduling & File Management"
            ),
            List.of("Operating Systems", "Operating System", "OS")
        ),
        new SubjectDefinition(
            "DBMS", "Database Management Systems", "CM-305", "DCME",
            List.of(
                "Concepts of DBMS, RDBMS & ER Modeling",
                "Concepts of SQL & Querying",
                "Basics of PL/SQL",
                "Advanced PL/SQL (Procedures, Functions & Triggers)",
                "Concepts of NoSQL & MongoDB"
            ),
            List.of("Database Management Systems", "DBMS", "Database")
        ),
        new SubjectDefinition(
            "DATA_STRUCTURES", "Data Structures through C", "CM-304", "DCME",
            List.of(
                "Introduction to Data Structures & Arrays",
                "Linked Storage Representation & Linked Lists",
                "Linear Data Structures - Stacks & Applications",
                "Linear Data Structures - Queues & Deques",
                "Non-Linear Data Structures - Trees & Traversals"
            ),
            List.of("Data Structures", "Data Structures through C", "DS")
        ),
        new SubjectDefinition(
            "JAVA_PROGRAMMING", "OOP through Java", "CM-404", "DCME",
            List.of(
                "OOP Concepts, Basics of Java & Overloading",
                "Inheritance, Method Overriding, Interfaces & Packages",
                "I/O Streams, File Handling & Collections Framework",
                "Exception Handling & Multi-Threaded Programming",
                "Applets, AWT & Event Handling"
            ),
            List.of("Java & OOPs", "Java Programming", "OOP through Java", "Java")
        ),
        new SubjectDefinition(
            "COMPUTER_NETWORKS", "Computer Networks & Cyber Security", "CM-405", "DCME",
            List.of(
                "Introduction to Networks & Reference Models",
                "Network Addressing, Subnetting & Protocols",
                "Introduction to Cyber Security & Threats",
                "Cryptography & Encryption Techniques",
                "System Security, Firewalls & Network Defense"
            ),
            List.of("Computer Networks", "Computer Networks & Cyber Security", "Networks")
        ),
        new SubjectDefinition(
            "COMPUTER_ORGANIZATION", "Computer Organization & Microprocessors", "CM-403", "DCME",
            List.of(
                "CPU Organization & Instruction Formats",
                "Information Representation & Arithmetic Operations",
                "Memory Organization & Cache Architecture",
                "I/O Organization & Direct Memory Access (DMA)",
                "8086 Microprocessor Architecture & Assembly"
            ),
            List.of("Computer Organization & Architecture", "Microprocessors & Microcontrollers", "Computer Organization and Microprocessors", "CO")
        ),
        new SubjectDefinition(
            "DIGITAL_ELECTRONICS", "Digital Electronics", "CM-302", "DCME",
            List.of(
                "Number Systems & Binary Codes",
                "Logic Gates, Boolean Algebra & Basic Combinational Circuits",
                "Flip-Flops & Latches",
                "Counters and Registers",
                "Additional Combinational Circuits"
            ),
            List.of("Digital Electronics", "DE")
        ),
        new SubjectDefinition(
            "SOFTWARE_ENGINEERING", "Software Engineering", "CM-401", "DCME",
            List.of(
                "Basics of Software Engineering & Life Cycle Models",
                "Software Project Management & Metrics",
                "Requirement Analysis & SRS Specifications",
                "Software Design, Modularization & Coding Standards",
                "Software Testing, Debugging, Quality & Maintenance"
            ),
            List.of("Software Engineering & Web", "Software Engineering", "SE")
        ),
        new SubjectDefinition(
            "WEB_TECHNOLOGIES", "Web Technologies", "CM-402", "DCME",
            List.of(
                "Principles of Web Designing & HTML Fundamentals",
                "HTML5 Elements & CSS Styling",
                "XML & Client-Side Scripting with JavaScript",
                "AJAX & jQuery",
                "Web Servers & Server-Side Scripting using PHP"
            ),
            List.of("Web Technologies", "Web Designing", "WT")
        ),
        new SubjectDefinition(
            "PYTHON_PROGRAMMING", "Python Programming", "CM-505", "DCME",
            List.of(
                "Introduction to Python Programming & Syntax",
                "Control Flow, Conditionals & Loops",
                "Functions, Modules & Arrays",
                "Built-in Data Structures (Lists, Tuples, Sets, Dictionaries)",
                "OOP in Python, File Handling & Exception Handling"
            ),
            List.of("Python Programming", "Python")
        ),
        new SubjectDefinition(
            "ANDROID_PROGRAMMING", "Android Programming", "CM-503", "DCME",
            List.of(
                "Android Basics, Architecture & Anatomy",
                "Components, Activity Life Cycle & Intents",
                "Android User Interface & Layouts",
                "Android Advanced Concepts (Services, Broadcasts, Notifications)",
                "Database Connectivity with SQLite"
            ),
            List.of("Android Programming", "Android")
        ),
        new SubjectDefinition(
            "IOT", "Internet of Things", "CM-504", "DCME",
            List.of(
                "Introduction to IoT Architecture & Elements",
                "IoT Data Protocols (MQTT, CoAP, XMPP, AMQP)",
                "Communication Technologies (Zigbee, BLE, NFC, IEEE 802.15.4)",
                "Wireless Sensor Networks & Actuators",
                "Role of IoT in Automation & Smart Applications"
            ),
            List.of("Internet of Things", "IoT")
        ),
        new SubjectDefinition(
            "CLOUD_AND_BIG_DATA", "Big Data & Cloud Computing", "CM-502", "DCME",
            List.of(
                "Overview of Data Mining & Knowledge Discovery",
                "Overview of Data Warehousing & OLAP",
                "Introduction to Big Data & Hadoop Ecosystem",
                "Big Data Analytics & Processing Frameworks",
                "Cloud Computing Concepts, Service & Deployment Models"
            ),
            List.of("Big Data & Cloud Computing", "Cloud Computing", "Big Data")
        ),
        new SubjectDefinition(
            "C_PROGRAMMING", "Programming in C", "CM-106", "DCME",
            List.of(
                "Introduction to C Language & Data Types",
                "I/O Statements, Operators & Expressions",
                "Decision Making & Iterative Control Loops",
                "Arrays, Strings, Structures & Unions",
                "User-Defined Functions, Pointers & File Handling"
            ),
            List.of("C Programming", "Programming in C", "C")
        ),
        new SubjectDefinition(
            "MATHEMATICS", "Engineering Mathematics", "CM-102/301", "GENERAL",
            List.of(
                "Matrices, Determinants & Algebra",
                "Trigonometry & Complex Numbers",
                "Coordinate Geometry (Lines, Circles & Conics)",
                "Differential Calculus & Applications",
                "Integral Calculus & Differential Equations"
            ),
            List.of("MATHEMATICS", "Mathematics", "Maths")
        ),
        new SubjectDefinition(
            "PHYSICS", "Engineering Physics", "CM-103", "GENERAL",
            List.of(
                "Units, Measurements & Vectors",
                "Statics, Kinematics & Friction",
                "Work, Power, Energy & Gravitation",
                "Thermal Physics & Sound",
                "Electricity, Magnetism & Modern Physics"
            ),
            List.of("PHYSICS", "Physics")
        ),
        new SubjectDefinition(
            "CHEMISTRY", "Engineering Chemistry", "CM-104", "GENERAL",
            List.of(
                "Atomic Structure & Chemical Bonding",
                "Solutions, Acids & Bases",
                "Electrochemistry & Corrosion",
                "Water Treatment & Environmental Chemistry",
                "Polymers, Engineering Materials & Fuels"
            ),
            List.of("CHEMISTRY", "Chemistry")
        )
    );

    public List<SubjectCatalog> getTopicsCatalog() {
        // Query live counts grouped by topic and concept from pyq_questions
        List<Map<String, Object>> rows = jdbc.queryForList("""
            SELECT subject,
                   COALESCE(NULLIF(TRIM(topic), ''), 'General') AS topic,
                   COALESCE(NULLIF(TRIM(concept), ''), '') AS concept,
                   COUNT(*) AS count
            FROM pyq_questions
            WHERE active = TRUE AND verified = TRUE
            GROUP BY subject, COALESCE(NULLIF(TRIM(topic), ''), 'General'), COALESCE(NULLIF(TRIM(concept), ''), '')
        """);

        List<SubjectCatalog> result = new ArrayList<>();

        for (SubjectDefinition def : C23_SUBJECTS) {
            Map<String, Integer> conceptCounts = new LinkedHashMap<>();
            for (String cName : def.conceptNames()) {
                conceptCounts.put(cName, 0);
            }

            int subjectTotal = 0;

            for (Map<String, Object> r : rows) {
                String sub = (String) r.get("subject");
                String top = (String) r.get("topic");
                String con = (String) r.get("concept");
                int count = ((Number) r.get("count")).intValue();

                boolean subjectMatches = false;
                if ("GENERAL".equals(def.stream())) {
                    if (def.id().equalsIgnoreCase(sub)) subjectMatches = true;
                } else {
                    if ("DCME".equalsIgnoreCase(sub)) {
                        for (String alias : def.aliases()) {
                            if (top.equalsIgnoreCase(alias) || top.toLowerCase().contains(alias.toLowerCase())) {
                                subjectMatches = true;
                                break;
                            }
                        }
                    }
                }

                if (subjectMatches) {
                    subjectTotal += count;
                    // Match to specific concept
                    if (!con.isEmpty()) {
                        for (String cName : def.conceptNames()) {
                            if (cName.equalsIgnoreCase(con) || cName.toLowerCase().contains(con.toLowerCase()) || con.toLowerCase().contains(cName.toLowerCase())) {
                                conceptCounts.put(cName, conceptCounts.getOrDefault(cName, 0) + count);
                                break;
                            }
                        }
                    } else {
                        // Spread unclassified to first concept
                        if (!def.conceptNames().isEmpty()) {
                            String first = def.conceptNames().get(0);
                            conceptCounts.put(first, conceptCounts.getOrDefault(first, 0) + count);
                        }
                    }
                }
            }

            List<ConceptInfo> conceptList = new ArrayList<>();
            for (String cName : def.conceptNames()) {
                conceptList.add(new ConceptInfo(cName, conceptCounts.getOrDefault(cName, 0)));
            }

            result.add(new SubjectCatalog(
                def.id(),
                def.displayName(),
                def.stream(),
                def.code(),
                subjectTotal,
                conceptList,
                conceptList
            ));
        }

        return result;
    }

    public record StartPracticeRequest(
        String subject,
        List<String> concepts,
        List<String> topics, // alias
        Integer questionCount,
        Boolean timed,
        Integer durationMinutes
    ) {}

    @Transactional
    public Map<String, Object> startPractice(StartPracticeRequest req, String studentEmail) {
        UUID studentId = jdbc.queryForObject(
            "SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, studentEmail);
        if (studentId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student account not found.");
        }

        String rawSubject = req.subject() == null ? "OPERATING_SYSTEMS" : req.subject().trim();
        SubjectDefinition matchedDef = C23_SUBJECTS.stream()
            .filter(d -> d.id().equalsIgnoreCase(rawSubject) || d.displayName().equalsIgnoreCase(rawSubject) || d.aliases().stream().anyMatch(a -> a.equalsIgnoreCase(rawSubject)))
            .findFirst()
            .orElse(C23_SUBJECTS.get(0));

        // Consolidate concepts list (fallback to topics if concepts not sent)
        List<String> selectedConceptsList = (req.concepts() != null && !req.concepts().isEmpty())
            ? req.concepts().stream().map(String::trim).filter(s -> !s.isBlank()).toList()
            : (req.topics() != null ? req.topics().stream().map(String::trim).filter(s -> !s.isBlank()).toList() : List.of());

        // Default to 50 questions as requested by student curriculum requirements
        int requestedTotal = (req.questionCount() == null || req.questionCount() <= 0) ? 50 : Math.min(100, req.questionCount());
        boolean isTimed = Boolean.TRUE.equals(req.timed());
        int duration = isTimed ? (req.durationMinutes() == null || req.durationMinutes() <= 0 ? 50 : req.durationMinutes()) : 0;

        String mode;
        List<String> activeConcepts;

        if (selectedConceptsList.isEmpty() || selectedConceptsList.size() >= matchedDef.conceptNames().size()) {
            // Entire Subject mode: all concepts involved
            mode = "SUBJECT";
            activeConcepts = matchedDef.conceptNames();
        } else if (selectedConceptsList.size() == 1) {
            // Single Concept mode
            mode = "CONCEPT";
            activeConcepts = selectedConceptsList;
        } else {
            // Multiple Concepts mode
            mode = "MULTI_CONCEPT";
            activeConcepts = selectedConceptsList;
        }

        String selectedConceptsStr = activeConcepts.isEmpty() ? null : String.join(", ", activeConcepts);

        // --- 50-Question Proportional Randomizer Engine ---
        List<Map<String, Object>> candidateQuestions = sampleProportionalQuestions(matchedDef, activeConcepts, requestedTotal);

        if (candidateQuestions.isEmpty()) {
            // General fallback query across subject pool
            candidateQuestions = jdbc.queryForList("""
                SELECT id, subject, topic, concept, question_text, explanation, difficulty
                FROM pyq_questions
                WHERE active = TRUE AND verified = TRUE
                ORDER BY RANDOM()
                LIMIT ?
            """, requestedTotal);
        }

        if (candidateQuestions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No verified questions found for this subject selection yet.");
        }

        // Shuffle final combined question list
        Collections.shuffle(candidateQuestions);

        UUID attemptId = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO practice_attempts(id, student_id, subject, mode, selected_concepts, selected_topics, total_questions, duration_minutes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'IN_PROGRESS')
        """, attemptId, studentId, matchedDef.displayName(), mode, selectedConceptsStr, selectedConceptsStr, candidateQuestions.size(), duration);

        List<Map<String, Object>> returnedQuestions = new ArrayList<>();
        int order = 1;

        for (Map<String, Object> cq : candidateQuestions) {
            UUID qId = (UUID) cq.get("id");
            UUID attemptQId = UUID.randomUUID();

            jdbc.update("""
                INSERT INTO practice_attempt_questions(id, attempt_id, question_id, question_order, subject, topic, concept, question_text, explanation, difficulty)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, attemptQId, attemptId, qId, order, cq.get("subject"), cq.get("topic"), cq.get("concept"), cq.get("question_text"), cq.get("explanation"), cq.get("difficulty"));

            // Copy options
            List<Map<String, Object>> options = jdbc.queryForList("""
                SELECT id, option_label, option_text, is_correct
                FROM pyq_question_options
                WHERE question_id = ?
                ORDER BY option_label ASC
            """, qId);

            List<Map<String, Object>> safeOptions = new ArrayList<>();
            for (var opt : options) {
                UUID optId = UUID.randomUUID();
                jdbc.update("""
                    INSERT INTO practice_attempt_options(id, attempt_question_id, option_label, option_text, is_correct)
                    VALUES (?, ?, ?, ?, ?)
                """, optId, attemptQId, opt.get("option_label"), opt.get("option_text"), opt.get("is_correct"));

                safeOptions.add(Map.of(
                    "id", optId,
                    "label", opt.get("option_label"),
                    "text", opt.get("option_text")
                ));
            }

            returnedQuestions.add(Map.of(
                "id", attemptQId,
                "questionOrder", order,
                "subject", cq.get("subject") == null ? matchedDef.displayName() : cq.get("subject"),
                "topic", cq.get("topic") == null ? "" : cq.get("topic"),
                "concept", cq.get("concept") == null ? "" : cq.get("concept"),
                "questionText", cq.get("question_text"),
                "options", safeOptions,
                "selectedOptionId", ""
            ));
            order++;
        }

        return Map.of(
            "attemptId", attemptId,
            "subject", matchedDef.displayName(),
            "mode", mode,
            "selectedConcepts", selectedConceptsStr == null ? "" : selectedConceptsStr,
            "selectedTopics", selectedConceptsStr == null ? "" : selectedConceptsStr,
            "totalQuestions", candidateQuestions.size(),
            "durationMinutes", duration,
            "status", "IN_PROGRESS",
            "questions", returnedQuestions
        );
    }

    private List<Map<String, Object>> sampleProportionalQuestions(
        SubjectDefinition def, List<String> activeConcepts, int totalTarget) {

        int conceptCount = Math.max(1, activeConcepts.size());
        int basePerConcept = totalTarget / conceptCount;
        int remainder = totalTarget % conceptCount;

        List<Map<String, Object>> selectedQuestions = new ArrayList<>();
        Set<UUID> chosenIds = new HashSet<>();

        // 1. Draw proportional allocation per concept
        String subjectFilter = "GENERAL".equals(def.stream())
            ? " AND subject = '" + def.id() + "'"
            : " AND subject = 'DCME'";

        for (int i = 0; i < conceptCount; i++) {
            String conceptName = activeConcepts.get(i);
            int quota = basePerConcept + (i < remainder ? 1 : 0);

            List<Map<String, Object>> conceptPool = jdbc.queryForList("""
                SELECT id, subject, topic, concept, question_text, explanation, difficulty
                FROM pyq_questions
                WHERE active = TRUE AND verified = TRUE
                  AND (concept ILIKE ? OR topic ILIKE ?)
            """ + subjectFilter + """
                ORDER BY RANDOM()
                LIMIT ?
            """, "%" + conceptName + "%", "%" + conceptName + "%", quota);

            for (var q : conceptPool) {
                UUID qid = (UUID) q.get("id");
                if (!chosenIds.contains(qid)) {
                    selectedQuestions.add(q);
                    chosenIds.add(qid);
                }
            }
        }

        // 2. Fallback / Top-up: if any concept had fewer questions than quota, top up from the parent subject pool
        if (selectedQuestions.size() < totalTarget) {
            int needed = totalTarget - selectedQuestions.size();

            // Match subject aliases or stream
            StringBuilder queryBuilder = new StringBuilder("""
                SELECT id, subject, topic, concept, question_text, explanation, difficulty
                FROM pyq_questions
                WHERE active = TRUE AND verified = TRUE
            """);

            if ("GENERAL".equals(def.stream())) {
                queryBuilder.append(" AND subject = '").append(def.id()).append("'");
            } else {
                queryBuilder.append(" AND (subject = 'DCME'");
                for (String alias : def.aliases()) {
                    queryBuilder.append(" OR topic ILIKE '%").append(alias.replace("'", "''")).append("%'");
                }
                queryBuilder.append(")");
            }

            queryBuilder.append(" ORDER BY RANDOM() LIMIT ").append(needed * 2);

            List<Map<String, Object>> subjectPool = jdbc.queryForList(queryBuilder.toString());
            for (var sq : subjectPool) {
                if (selectedQuestions.size() >= totalTarget) break;
                UUID sqId = (UUID) sq.get("id");
                if (!chosenIds.contains(sqId)) {
                    selectedQuestions.add(sq);
                    chosenIds.add(sqId);
                }
            }
        }

        return selectedQuestions;
    }

    public record SaveAnswerRequest(UUID selectedOptionId) {}

    @Transactional
    public void saveAnswer(UUID attemptId, UUID questionId, SaveAnswerRequest req, String studentEmail) {
        UUID studentId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, studentEmail);
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM practice_attempts WHERE id=? AND student_id=? AND status='IN_PROGRESS'",
            Integer.class, attemptId, studentId);
        if (count == null || count == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Active practice attempt not found.");
        }

        if (req.selectedOptionId() == null) {
            jdbc.update("UPDATE practice_attempt_questions SET selected_option_id=NULL, is_correct=NULL WHERE id=? AND attempt_id=?", questionId, attemptId);
            return;
        }

        Boolean isCorrect = jdbc.queryForObject(
            "SELECT is_correct FROM practice_attempt_options WHERE id=? AND attempt_question_id=?",
            Boolean.class, req.selectedOptionId(), questionId);

        jdbc.update(
            "UPDATE practice_attempt_questions SET selected_option_id=?, is_correct=? WHERE id=? AND attempt_id=?",
            req.selectedOptionId(), Boolean.TRUE.equals(isCorrect), questionId, attemptId);
    }

    @Transactional
    public Map<String, Object> submitPractice(UUID attemptId, String studentEmail) {
        UUID studentId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, studentEmail);
        Map<String, Object> attempt = jdbc.queryForMap(
            "SELECT * FROM practice_attempts WHERE id=? AND student_id=?", attemptId, studentId);

        int total = ((Number) attempt.get("total_questions")).intValue();
        Integer correct = jdbc.queryForObject(
            "SELECT COUNT(*) FROM practice_attempt_questions WHERE attempt_id=? AND is_correct=TRUE", Integer.class, attemptId);
        Integer answered = jdbc.queryForObject(
            "SELECT COUNT(*) FROM practice_attempt_questions WHERE attempt_id=? AND selected_option_id IS NOT NULL", Integer.class, attemptId);

        int correctCount = correct == null ? 0 : correct;
        int answeredCount = answered == null ? 0 : answered;
        int incorrectCount = answeredCount - correctCount;
        int unansweredCount = total - answeredCount;
        double accuracy = total > 0 ? (correctCount * 100.0) / total : 0.0;

        jdbc.update("""
            UPDATE practice_attempts
            SET status='SUBMITTED', submitted_at=CURRENT_TIMESTAMP, score=?, correct_count=?,
                incorrect_count=?, unanswered_count=?, accuracy=?
            WHERE id=?
        """, correctCount, correctCount, incorrectCount, unansweredCount, accuracy, attemptId);

        return getPracticeReview(attemptId, studentEmail);
    }

    public Map<String, Object> getPracticeReview(UUID attemptId, String studentEmail) {
        UUID studentId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, studentEmail);
        Map<String, Object> attempt = jdbc.queryForMap(
            "SELECT * FROM practice_attempts WHERE id=? AND student_id=?", attemptId, studentId);

        List<Map<String, Object>> questions = jdbc.queryForList("""
            SELECT id, question_order, subject, topic, concept, question_text, explanation, difficulty, selected_option_id, is_correct
            FROM practice_attempt_questions
            WHERE attempt_id=?
            ORDER BY question_order ASC
        """, attemptId);

        List<Map<String, Object>> reviewQuestions = new ArrayList<>();
        for (var q : questions) {
            UUID qId = (UUID) q.get("id");
            List<Map<String, Object>> options = jdbc.queryForList("""
                SELECT id, option_label, option_text, is_correct
                FROM practice_attempt_options
                WHERE attempt_question_id=?
                ORDER BY option_label ASC
            """, qId);

            Map<String, Object> qMap = new LinkedHashMap<>();
            qMap.put("id", qId);
            qMap.put("questionOrder", q.get("question_order"));
            qMap.put("subject", q.get("subject"));
            qMap.put("topic", q.get("topic") == null ? "" : q.get("topic"));
            qMap.put("concept", q.get("concept") == null ? "" : q.get("concept"));
            qMap.put("questionText", q.get("question_text"));
            qMap.put("explanation", q.get("explanation") == null ? "" : q.get("explanation"));
            qMap.put("difficulty", q.get("difficulty") == null ? "MEDIUM" : q.get("difficulty"));
            qMap.put("selectedOptionId", q.get("selected_option_id") == null ? "" : q.get("selected_option_id").toString());
            qMap.put("isCorrect", Boolean.TRUE.equals(q.get("is_correct")));
            qMap.put("options", options);

            reviewQuestions.add(qMap);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("attemptId", attemptId);
        response.put("subject", attempt.get("subject"));
        response.put("mode", attempt.get("mode"));
        response.put("selectedConcepts", attempt.get("selected_concepts") == null ? "" : attempt.get("selected_concepts"));
        response.put("selectedTopics", attempt.get("selected_topics") == null ? "" : attempt.get("selected_topics"));
        response.put("totalQuestions", attempt.get("total_questions"));
        response.put("durationMinutes", attempt.get("duration_minutes"));
        response.put("status", attempt.get("status"));
        response.put("score", attempt.get("score") == null ? 0 : attempt.get("score"));
        response.put("correctCount", attempt.get("correct_count") == null ? 0 : attempt.get("correct_count"));
        response.put("incorrectCount", attempt.get("incorrect_count") == null ? 0 : attempt.get("incorrect_count"));
        response.put("unansweredCount", attempt.get("unanswered_count") == null ? 0 : attempt.get("unanswered_count"));
        response.put("accuracy", attempt.get("accuracy") == null ? 0.0 : attempt.get("accuracy"));
        response.put("questions", reviewQuestions);
        return response;
    }

    public List<Map<String, Object>> getRecentAttempts(String studentEmail) {
        UUID studentId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, studentEmail);
        return jdbc.queryForList("""
            SELECT id, subject, mode, selected_concepts AS "selectedConcepts", selected_topics AS "selectedTopics", total_questions AS "totalQuestions",
                   score, correct_count AS "correctCount", accuracy, started_at AS "startedAt", submitted_at AS "submittedAt", status
            FROM practice_attempts
            WHERE student_id=? AND status='SUBMITTED'
            ORDER BY started_at DESC
            LIMIT 10
        """, studentId);
    }
}
