package com.ecetdesk.api.practice;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Array;
import java.util.*;

@Service
public class PracticeService {

    private final JdbcTemplate jdbc;

    public PracticeService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record TopicInfo(String name, int questionCount) {}
    public record SubjectCatalog(String subject, String displayName, int totalQuestions, List<TopicInfo> topics) {}

    public List<SubjectCatalog> getTopicsCatalog() {
        // Query distinct subjects and topics from pyq_questions
        List<Map<String, Object>> rows = jdbc.queryForList("""
            SELECT subject, COALESCE(NULLIF(TRIM(topic), ''), 'General Practice') AS topic, COUNT(*) AS count
            FROM pyq_questions
            WHERE active = TRUE AND verified = TRUE
            GROUP BY subject, COALESCE(NULLIF(TRIM(topic), ''), 'General Practice')
            ORDER BY subject, count DESC
        """);

        Map<String, List<TopicInfo>> topicsBySubject = new LinkedHashMap<>();
        Map<String, Integer> totalsBySubject = new LinkedHashMap<>();

        // Ensure all 4 core subjects are initialized
        for (String sub : List.of("DCME", "MATHEMATICS", "PHYSICS", "CHEMISTRY")) {
            topicsBySubject.put(sub, new ArrayList<>());
            totalsBySubject.put(sub, 0);
        }

        for (Map<String, Object> row : rows) {
            String subject = (String) row.get("subject");
            String topic = (String) row.get("topic");
            int count = ((Number) row.get("count")).intValue();

            topicsBySubject.computeIfAbsent(subject, k -> new ArrayList<>()).add(new TopicInfo(topic, count));
            totalsBySubject.put(subject, totalsBySubject.getOrDefault(subject, 0) + count);
        }

        Map<String, String> displayNames = Map.of(
            "DCME", "Computer Engineering (DCME)",
            "MATHEMATICS", "Engineering Mathematics",
            "PHYSICS", "Engineering Physics",
            "CHEMISTRY", "Engineering Chemistry"
        );

        List<SubjectCatalog> result = new ArrayList<>();
        for (var entry : topicsBySubject.entrySet()) {
            String sub = entry.getKey();
            result.add(new SubjectCatalog(
                sub,
                displayNames.getOrDefault(sub, sub),
                totalsBySubject.getOrDefault(sub, 0),
                entry.getValue()
            ));
        }
        return result;
    }

    public record StartPracticeRequest(
        String subject,
        List<String> topics,
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

        String subject = req.subject() == null ? "DCME" : req.subject().trim().toUpperCase(Locale.ROOT);
        if (!Set.of("DCME", "MATHEMATICS", "PHYSICS", "CHEMISTRY").contains(subject)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid subject. Must be DCME, MATHEMATICS, PHYSICS, or CHEMISTRY.");
        }

        int requestedCount = req.questionCount() == null || req.questionCount() <= 0 ? 15 : Math.min(50, req.questionCount());
        boolean isTimed = Boolean.TRUE.equals(req.timed());
        int duration = isTimed ? (req.durationMinutes() == null || req.durationMinutes() <= 0 ? requestedCount : req.durationMinutes()) : 0;

        List<String> topics = req.topics() == null ? List.of() : req.topics().stream().map(String::trim).filter(s -> !s.isBlank()).toList();
        String mode = topics.isEmpty() ? "SUBJECT" : (topics.size() == 1 ? "TOPIC" : "MULTI_TOPIC");
        String selectedTopicsStr = topics.isEmpty() ? null : String.join(", ", topics);

        // Fetch matching questions
        List<Map<String, Object>> candidateQuestions;
        if (topics.isEmpty()) {
            candidateQuestions = jdbc.queryForList("""
                SELECT id, subject, topic, question_text, explanation, difficulty
                FROM pyq_questions
                WHERE active = TRUE AND verified = TRUE AND subject = ?
                ORDER BY RANDOM()
                LIMIT ?
            """, subject, requestedCount);
        } else {
            // Match any of selected topics
            String inClause = String.join("','", topics.stream().map(t -> t.replace("'", "''")).toList());
            candidateQuestions = jdbc.queryForList("""
                SELECT id, subject, topic, question_text, explanation, difficulty
                FROM pyq_questions
                WHERE active = TRUE AND verified = TRUE AND subject = ? AND topic IN ('""" + inClause + """
                ')
                ORDER BY RANDOM()
                LIMIT ?
            """, subject, requestedCount);
        }

        // Fallback to general subject questions if specific topic filter had too few
        if (candidateQuestions.size() < requestedCount) {
            int needed = requestedCount - candidateQuestions.size();
            Set<UUID> existingIds = new HashSet<>();
            for (var q : candidateQuestions) existingIds.add((UUID) q.get("id"));

            List<Map<String, Object>> extra = jdbc.queryForList("""
                SELECT id, subject, topic, question_text, explanation, difficulty
                FROM pyq_questions
                WHERE active = TRUE AND verified = TRUE AND subject = ?
                ORDER BY RANDOM()
                LIMIT ?
            """, subject, requestedCount);

            for (var eq : extra) {
                if (candidateQuestions.size() >= requestedCount) break;
                UUID eqId = (UUID) eq.get("id");
                if (!existingIds.contains(eqId)) {
                    candidateQuestions.add(eq);
                    existingIds.add(eqId);
                }
            }
        }

        if (candidateQuestions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No verified questions found for this topic selection yet.");
        }

        UUID attemptId = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO practice_attempts(id, student_id, subject, mode, selected_topics, total_questions, duration_minutes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'IN_PROGRESS')
        """, attemptId, studentId, subject, mode, selectedTopicsStr, candidateQuestions.size(), duration);

        List<Map<String, Object>> returnedQuestions = new ArrayList<>();
        int order = 1;

        for (Map<String, Object> cq : candidateQuestions) {
            UUID qId = (UUID) cq.get("id");
            UUID attemptQId = UUID.randomUUID();

            jdbc.update("""
                INSERT INTO practice_attempt_questions(id, attempt_id, question_id, question_order, subject, topic, question_text, explanation, difficulty)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, attemptQId, attemptId, qId, order, cq.get("subject"), cq.get("topic"), cq.get("question_text"), cq.get("explanation"), cq.get("difficulty"));

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
                "subject", cq.get("subject"),
                "topic", cq.get("topic") == null ? "" : cq.get("topic"),
                "questionText", cq.get("question_text"),
                "options", safeOptions,
                "selectedOptionId", ""
            ));
            order++;
        }

        return Map.of(
            "attemptId", attemptId,
            "subject", subject,
            "mode", mode,
            "selectedTopics", selectedTopicsStr == null ? "" : selectedTopicsStr,
            "totalQuestions", candidateQuestions.size(),
            "durationMinutes", duration,
            "status", "IN_PROGRESS",
            "questions", returnedQuestions
        );
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
            SELECT id, question_order, subject, topic, question_text, explanation, difficulty, selected_option_id, is_correct
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

            reviewQuestions.add(Map.of(
                "id", qId,
                "questionOrder", q.get("question_order"),
                "subject", q.get("subject"),
                "topic", q.get("topic") == null ? "" : q.get("topic"),
                "questionText", q.get("question_text"),
                "explanation", q.get("explanation") == null ? "" : q.get("explanation"),
                "difficulty", q.get("difficulty") == null ? "MEDIUM" : q.get("difficulty"),
                "selectedOptionId", q.get("selected_option_id") == null ? "" : q.get("selected_option_id").toString(),
                "isCorrect", Boolean.TRUE.equals(q.get("is_correct")),
                "options", options
            ));
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("attemptId", attemptId);
        response.put("subject", attempt.get("subject"));
        response.put("mode", attempt.get("mode"));
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
            SELECT id, subject, mode, selected_topics AS "selectedTopics", total_questions AS "totalQuestions",
                   score, correct_count AS "correctCount", accuracy, started_at AS "startedAt", submitted_at AS "submittedAt", status
            FROM practice_attempts
            WHERE student_id=? AND status='SUBMITTED'
            ORDER BY started_at DESC
            LIMIT 10
        """, studentId);
    }
}
