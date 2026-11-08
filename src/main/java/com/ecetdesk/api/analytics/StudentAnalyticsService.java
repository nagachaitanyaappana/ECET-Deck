package com.ecetdesk.api.analytics;

import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentAnalyticsService {
    private final JdbcTemplate jdbc;
    public StudentAnalyticsService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public Map<String,Object> getMyAnalytics(String email) {
        UUID studentId;
        try {
            studentId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?) AND role='STUDENT'", UUID.class, email);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Student analytics are available to student accounts only.");
        }

        List<Map<String,Object>> history = jdbc.queryForList("""
            SELECT a.id AS "attemptId",'AI' AS "assessmentType",t.test_type AS "testCategory",
                   t.title,a.score,t.total_marks AS "totalMarks",a.submitted_at AS "submittedAt"
            FROM test_attempts a JOIN tests t ON t.id=a.test_id
            WHERE a.student_id=? AND a.status IN ('SUBMITTED','TIMED_OUT')
            UNION ALL
            SELECT a.id AS "attemptId",'PYQ' AS "assessmentType",'PYQ' AS "testCategory",
                   'PYQ Challenge' AS title,a.score,a.total_questions AS "totalMarks",a.submitted_at AS "submittedAt"
            FROM pyq_attempts a
            WHERE a.student_id=? AND a.status IN ('SUBMITTED','TIMED_OUT')
            ORDER BY "submittedAt" ASC
            """, studentId, studentId);

        Map<String,Double> previousByType = new HashMap<>();
        for (Map<String,Object> item : history) {
            double percent = percent(item.get("score"), item.get("totalMarks"));
            String type = (String)item.get("assessmentType");
            Double previous = previousByType.put(type, percent);
            item.put("percentage", Math.round(percent * 10.0) / 10.0);
            item.put("changeFromPrevious", previous == null ? null : Math.round((percent - previous) * 10.0) / 10.0);
        }

        List<Map<String,Object>> subjects = jdbc.queryForList("""
            SELECT subject, SUM(attempt_count)::INTEGER AS "attemptCount",
                   SUM(question_count)::INTEGER AS "questionsSeen",
                   SUM(correct_count)::INTEGER AS "correctCount"
            FROM (
                SELECT q.subject,COUNT(DISTINCT a.id) AS attempt_count,COUNT(q.id) AS question_count,
                       COUNT(*) FILTER (WHERE sa.is_correct=TRUE) AS correct_count
                FROM test_attempts a
                JOIN test_questions tq ON tq.test_id=a.test_id
                JOIN questions q ON q.id=tq.question_id
                LEFT JOIN student_answers sa ON sa.attempt_id=a.id AND sa.question_id=q.id
                WHERE a.student_id=? AND a.status IN ('SUBMITTED','TIMED_OUT')
                GROUP BY q.subject
                UNION ALL
                SELECT q.subject,COUNT(DISTINCT a.id),COUNT(q.id),
                       COUNT(*) FILTER (WHERE sa.is_correct=TRUE)
                FROM pyq_attempts a
                JOIN pyq_attempt_questions aq ON aq.attempt_id=a.id
                JOIN pyq_questions q ON q.id=aq.question_id
                LEFT JOIN pyq_student_answers sa ON sa.attempt_id=a.id AND sa.question_id=q.id
                WHERE a.student_id=? AND a.status IN ('SUBMITTED','TIMED_OUT')
                GROUP BY q.subject
            ) performance
            GROUP BY subject ORDER BY subject
            """, studentId, studentId);
        for (Map<String,Object> subject : subjects) {
            int seen = ((Number)subject.get("questionsSeen")).intValue();
            int correct = ((Number)subject.get("correctCount")).intValue();
            double accuracy = seen == 0 ? 0 : correct * 100.0 / seen;
            subject.put("accuracy", Math.round(accuracy * 10.0) / 10.0);
            subject.put("status", accuracy >= 75 ? "STRONG" : accuracy >= 55 ? "DEVELOPING" : "NEEDS_ATTENTION");
        }

        List<Map<String,Object>> topics = jdbc.queryForList("""
            SELECT COALESCE(NULLIF(trim(q.topic),''),'Uncategorised') AS topic,
                   q.subject,COUNT(*)::INTEGER AS "questionsSeen",
                   COUNT(*) FILTER (WHERE sa.is_correct=TRUE)::INTEGER AS "correctCount"
            FROM pyq_attempts a
            JOIN pyq_attempt_questions aq ON aq.attempt_id=a.id
            JOIN pyq_questions q ON q.id=aq.question_id
            LEFT JOIN pyq_student_answers sa ON sa.attempt_id=a.id AND sa.question_id=q.id
            WHERE a.student_id=? AND a.status IN ('SUBMITTED','TIMED_OUT')
            GROUP BY COALESCE(NULLIF(trim(q.topic),''),'Uncategorised'),q.subject
            HAVING COUNT(*) >= 3
            ORDER BY (COUNT(*) FILTER (WHERE sa.is_correct=TRUE)::DECIMAL / NULLIF(COUNT(*),0)) ASC, COUNT(*) DESC
            LIMIT 8
            """, studentId);
        for (Map<String,Object> topic : topics) {
            int seen=((Number)topic.get("questionsSeen")).intValue();
            int correct=((Number)topic.get("correctCount")).intValue();
            topic.put("accuracy",Math.round(correct*1000.0/seen)/10.0);
        }

        List<Map<String,Object>> recent = new ArrayList<>(history);
        Collections.reverse(recent);
        List<Map<String,Object>> lastThree = recent.stream().limit(3).toList();
        double average = lastThree.isEmpty() ? 0 : lastThree.stream().mapToDouble(x -> ((Number)x.get("percentage")).doubleValue()).average().orElse(0);
        String status = recent.size() < 3 ? "GETTING_STARTED" : average >= 80 ? "EXAM_READY" : average >= 65 ? "GOOD_PREPARATION" : average >= 50 ? "MAKING_PROGRESS" : "NEEDS_IMPROVEMENT";

        Map<String,Object> summary = new LinkedHashMap<>();
        summary.put("completedAttempts", history.size());
        summary.put("recentAverage", Math.round(average*10.0)/10.0);
        summary.put("personalBest", history.stream().mapToDouble(x -> ((Number)x.get("percentage")).doubleValue()).max().orElse(0));
        summary.put("preparationStatus", status);
        summary.put("statusBasedOnAttempts", Math.min(3, history.size()));

        List<String> recommendations = new ArrayList<>();
        subjects.stream().filter(s -> ((Number)s.get("questionsSeen")).intValue() >= 5)
            .min(Comparator.comparingDouble(s -> ((Number)s.get("accuracy")).doubleValue()))
            .ifPresent(s -> recommendations.add("Give extra practice to " + s.get("subject") + ": your current accuracy is " + s.get("accuracy") + "%."));
        topics.stream().limit(3).forEach(t -> recommendations.add("Revise " + t.get("topic") + " (" + t.get("subject") + "): accuracy is " + t.get("accuracy") + "% across attempted PYQ questions."));
        if (history.size() < 3) recommendations.add("Complete at least three tests to get a more reliable preparation-status estimate.");
        if (recommendations.isEmpty()) recommendations.add("Keep attempting tests. Subject and topic insights will become more useful as more answers are recorded.");

        Map<String,Object> response = new LinkedHashMap<>();
        response.put("summary", summary);
        response.put("history", history);
        response.put("subjects", subjects);
        response.put("weakTopics", topics);
        response.put("recommendations", recommendations);
        return response;
    }

    private double percent(Object score, Object total) {
        if (!(score instanceof Number s) || !(total instanceof Number t) || t.doubleValue() <= 0) return 0;
        return s.doubleValue() * 100.0 / t.doubleValue();
    }
}
