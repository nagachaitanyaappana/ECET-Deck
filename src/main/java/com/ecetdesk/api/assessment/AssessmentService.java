package com.ecetdesk.api.assessment;

import java.time.Duration;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AssessmentService {
    private static final Map<String, Map<String, Integer>> BLUEPRINTS = Map.of(
        "GRAND", Map.of("DCME",100,"MATHEMATICS",50,"PHYSICS",25,"CHEMISTRY",25),
        "DAILY", Map.of("DCME",25,"MATHEMATICS",13,"PHYSICS",6,"CHEMISTRY",6)
    );
    private final JdbcTemplate jdbc;
    private final OpenRouterQuestionGenerator generator;

    public AssessmentService(JdbcTemplate jdbc, OpenRouterQuestionGenerator generator) {
        this.jdbc = jdbc;
        this.generator = generator;
    }

    @Transactional
    public Map<String,Object> createTest(AssessmentController.CreateTestRequest r, String email) {
        String type = r.testType();
        LocalDate date = null;
        if ("DAILY".equals(type)) {
            if (r.scheduledDate() == null || r.scheduledDate().isBlank())
                throw bad("scheduledDate is required for a daily mock (YYYY-MM-DD).");
            try { date = LocalDate.parse(r.scheduledDate()); }
            catch (Exception ex) { throw bad("scheduledDate must use YYYY-MM-DD."); }
        } else if (r.scheduledDate() != null && !r.scheduledDate().isBlank()) {
            throw bad("Grand Tests do not use a scheduled date.");
        }
        UUID adminId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, email);
        UUID id = UUID.randomUUID();
        int count = "GRAND".equals(type) ? 200 : 50;
        int duration = "GRAND".equals(type) ? 180 : 0;
        jdbc.update("INSERT INTO tests(id,title,test_type,status,scheduled_date,question_count,duration_minutes,total_marks,created_by) VALUES (?,?,?,'DRAFT',?,?,?,?,?)",
            id,r.title().trim(),type,date,count,duration,count,adminId);
        BLUEPRINTS.get(type).forEach((subject, amount) ->
            jdbc.update("INSERT INTO test_subject_allocations(test_id,subject,question_count) VALUES (?,?,?)",id,subject,amount));
        return one("SELECT id,title,test_type AS \"testType\",status,scheduled_date AS \"scheduledDate\",question_count AS \"questionCount\",duration_minutes AS \"durationMinutes\",total_marks AS \"totalMarks\" FROM tests WHERE id=?",id);
    }

    @Transactional
    public Map<String,Object> createQuestion(AssessmentController.CreateQuestionRequest r) {
        long correct = r.options().stream().filter(o -> Boolean.TRUE.equals(o.correct())).count();
        if (correct != 1) throw bad("Exactly one of the four options must be marked correct.");
        UUID id = UUID.randomUUID();
        jdbc.update("INSERT INTO questions(id,subject,question_text,explanation,difficulty) VALUES (?,?,?,?,?)",
            id,r.subject(),r.questionText().trim(),r.explanation(),r.difficulty());
        char label = 'A';
        for (var option : r.options()) {
            jdbc.update("INSERT INTO question_options(id,question_id,option_label,option_text,is_correct) VALUES (?,?,?,?,?)",
                UUID.randomUUID(),id,String.valueOf(label++),option.text().trim(),option.correct());
        }
        return Map.of("id",id,"subject",r.subject(),"questionText",r.questionText(),"optionCount",4);
    }

    @Transactional
    public Map<String,Object> addQuestion(UUID testId, UUID questionId) {
        Map<String,Object> test = test(testId);
        if (!"DRAFT".equals(test.get("status"))) throw conflict("Questions can only be added to a draft test.");
        Integer order = jdbc.queryForObject("SELECT COALESCE(MAX(question_order),0)+1 FROM test_questions WHERE test_id=?",Integer.class,testId);
        jdbc.update("INSERT INTO test_questions(test_id,question_id,question_order,marks) VALUES (?,?,?,1)",testId,questionId,order);
        return Map.of("testId",testId,"questionId",questionId,"questionOrder",order);
    }

    @Transactional
    public Map<String,Object> publish(UUID testId) {
        Map<String,Object> test = test(testId);
        if (!"DRAFT".equals(test.get("status"))) throw conflict("Only draft tests can be published.");
        Integer total = jdbc.queryForObject("SELECT COUNT(*) FROM test_questions WHERE test_id=?",Integer.class,testId);
        int expected = ((Number)test.get("question_count")).intValue();
        if (total != expected) throw bad("This test needs exactly "+expected+" questions; it currently has "+total+".");
        List<Map<String,Object>> allocations = jdbc.queryForList("SELECT subject,question_count FROM test_subject_allocations WHERE test_id=?",testId);
        for (var allocation : allocations) {
            String subject = (String)allocation.get("subject");
            int expectedSubject = BLUEPRINTS.get((String)test.get("test_type")).get(subject);
            Integer actual = jdbc.queryForObject("SELECT COUNT(*) FROM test_questions tq JOIN questions q ON q.id=tq.question_id WHERE tq.test_id=? AND q.subject=?",Integer.class,testId,subject);
            if (actual != expectedSubject) throw bad(subject+" requires "+expectedSubject+" questions, but has "+actual+".");
        }
        Integer invalid = jdbc.queryForObject("""
            SELECT COUNT(*) FROM test_questions tq
            WHERE tq.test_id=? AND (
              (SELECT COUNT(*) FROM question_options qo WHERE qo.question_id=tq.question_id) <> 4
              OR (SELECT COUNT(*) FROM question_options qo WHERE qo.question_id=tq.question_id AND qo.is_correct) <> 1
            )
            """,Integer.class,testId);
        if (invalid != null && invalid > 0) throw bad("Every question must have exactly four options and exactly one correct answer.");
        jdbc.update("UPDATE tests SET status='PUBLISHED',published_at=CURRENT_TIMESTAMP WHERE id=?",testId);
        return Map.of("id",testId,"status","PUBLISHED","questionCount",expected);
    }

    public List<Map<String,Object>> availableTests() {
        return jdbc.queryForList("""
            SELECT id,title,test_type AS \"testType\",scheduled_date AS \"scheduledDate\",
                   question_count AS \"questionCount\",duration_minutes AS \"durationMinutes\",total_marks AS \"totalMarks\"
            FROM tests WHERE status='PUBLISHED' AND (test_type='GRAND' OR scheduled_date=CURRENT_DATE)
            ORDER BY published_at DESC
            """);
    }

    @Transactional
    public Map<String,Object> startAttempt(UUID testId, String email) {
        Map<String,Object> test = test(testId);
        if (!"PUBLISHED".equals(test.get("status"))) throw conflict("This test is not available.");
        if ("DAILY".equals(test.get("test_type")) && !LocalDate.now().equals(((java.sql.Date)test.get("scheduled_date")).toLocalDate()))
            throw conflict("This daily mock is not available today.");
        UUID student = studentId(email);
        List<Map<String,Object>> existing = jdbc.queryForList("SELECT id,status FROM test_attempts WHERE test_id=? AND student_id=?",testId,student);
        if (!existing.isEmpty()) throw conflict("You have already started or submitted this test.");
        UUID attempt = UUID.randomUUID();
        jdbc.update("INSERT INTO test_attempts(id,test_id,student_id) VALUES (?,?,?)",attempt,testId,student);
        return getAttempt(attempt,email);
    }

    public Map<String,Object> getAttempt(UUID attemptId, String email) {
        Map<String,Object> attempt = ownedAttempt(attemptId,email);
        List<Map<String,Object>> questions = jdbc.queryForList("""
            SELECT q.id,q.subject,q.question_text AS \"questionText\",tq.question_order AS \"questionOrder\"
            FROM test_questions tq JOIN questions q ON q.id=tq.question_id
            WHERE tq.test_id=? ORDER BY tq.question_order
            """,attempt.get("test_id"));
        for (var q : questions) {
            q.put("options",jdbc.queryForList("SELECT id,option_label AS label,option_text AS text FROM question_options WHERE question_id=? ORDER BY option_label",q.get("id")));
            List<Map<String,Object>> answer = jdbc.queryForList("SELECT selected_option_id FROM student_answers WHERE attempt_id=? AND question_id=?",attemptId,q.get("id"));
            q.put("selectedOptionId",answer.isEmpty()?null:answer.get(0).get("selected_option_id"));
        }
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("attemptId",attemptId); result.put("status",attempt.get("status"));
        result.put("startedAt",attempt.get("started_at")); result.put("questions",questions);
        return result;
    }

    @Transactional
    public Map<String,Object> saveAnswer(UUID attemptId, UUID questionId, UUID optionId, String email) {
        Map<String,Object> attempt = ownedAttempt(attemptId,email);
        if (!"IN_PROGRESS".equals(attempt.get("status"))) throw conflict("This attempt is already submitted.");
        Integer valid = jdbc.queryForObject("""
            SELECT COUNT(*) FROM test_questions tq JOIN question_options qo ON qo.question_id=tq.question_id
            WHERE tq.test_id=? AND tq.question_id=? AND qo.id=?
            """,Integer.class,attempt.get("test_id"),questionId,optionId);
        if (valid == null || valid != 1) throw bad("The selected option does not belong to this test question.");
        jdbc.update("""
            INSERT INTO student_answers(attempt_id,question_id,selected_option_id)
            VALUES (?,?,?) ON CONFLICT (attempt_id,question_id)
            DO UPDATE SET selected_option_id=EXCLUDED.selected_option_id,answered_at=CURRENT_TIMESTAMP
            """,attemptId,questionId,optionId);
        return Map.of("saved",true,"questionId",questionId);
    }

    @Transactional
    public Map<String,Object> submit(UUID attemptId, String email) {
        Map<String,Object> attempt = ownedAttempt(attemptId,email);
        if (!"IN_PROGRESS".equals(attempt.get("status"))) throw conflict("This attempt has already been submitted.");
        UUID testId = (UUID)attempt.get("test_id");
        int total = jdbc.queryForObject("SELECT COUNT(*) FROM test_questions WHERE test_id=?",Integer.class,testId);
        int correct = jdbc.queryForObject("""
            SELECT COUNT(*) FROM student_answers sa
            JOIN question_options qo ON qo.id=sa.selected_option_id AND qo.is_correct=TRUE
            WHERE sa.attempt_id=?
            """,Integer.class,attemptId);
        int answered = jdbc.queryForObject("SELECT COUNT(*) FROM student_answers WHERE attempt_id=? AND selected_option_id IS NOT NULL",Integer.class,attemptId);
        int incorrect = answered-correct, unanswered=total-answered;
        jdbc.update("""
            UPDATE student_answers sa SET is_correct=qo.is_correct,marks_awarded=CASE WHEN qo.is_correct THEN 1 ELSE 0 END
            FROM question_options qo WHERE sa.attempt_id=? AND qo.id=sa.selected_option_id
            """,attemptId);
        jdbc.update("""
            UPDATE test_attempts SET status='SUBMITTED',submitted_at=CURRENT_TIMESTAMP,
              score=?,correct_count=?,incorrect_count=?,unanswered_count=? WHERE id=?
            """,correct,correct,incorrect,unanswered,attemptId);
        Map<String,Object> timing = jdbc.queryForMap("SELECT started_at,submitted_at,EXTRACT(EPOCH FROM (submitted_at-started_at))::BIGINT AS elapsed_seconds FROM test_attempts WHERE id=?",attemptId);
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("attemptId",attemptId);result.put("status","SUBMITTED");result.put("score",correct);
        result.put("totalMarks",total);result.put("correct",correct);result.put("incorrect",incorrect);
        result.put("unanswered",unanswered);result.put("startedAt",timing.get("started_at"));
        result.put("submittedAt",timing.get("submitted_at"));result.put("elapsedSeconds",timing.get("elapsed_seconds"));
        return result;
    }

    public List<Map<String,Object>> myResults(String email) {
        return jdbc.queryForList("""
            SELECT a.id AS \"attemptId\",t.title,t.test_type AS \"testType\",a.score,
              a.correct_count AS correct,a.incorrect_count AS incorrect,a.unanswered_count AS unanswered,
              a.started_at AS \"startedAt\",a.submitted_at AS \"submittedAt\",
              CASE WHEN a.submitted_at IS NULL THEN NULL ELSE EXTRACT(EPOCH FROM (a.submitted_at-a.started_at))::BIGINT END AS \"elapsedSeconds\"
            FROM test_attempts a JOIN tests t ON t.id=a.test_id
            WHERE a.student_id=? AND a.status='SUBMITTED' ORDER BY a.submitted_at DESC
            """,studentId(email));
    }

    private Map<String,Object> ownedAttempt(UUID id,String email) {
        List<Map<String,Object>> rows=jdbc.queryForList("SELECT * FROM test_attempts WHERE id=? AND student_id=?",id,studentId(email));
        if(rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Attempt not found.");
        return rows.get(0);
    }
    private UUID studentId(String email) {
        return jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)",UUID.class,email);
    }
    private Map<String,Object> test(UUID id) {
        List<Map<String,Object>> rows=jdbc.queryForList("SELECT * FROM tests WHERE id=?",id);
        if(rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Test not found.");
        return rows.get(0);
    }
    private Map<String,Object> one(String sql,Object... args) { return jdbc.queryForMap(sql,args); }
    private ResponseStatusException bad(String message) { return new ResponseStatusException(HttpStatus.BAD_REQUEST,message); }
    private ResponseStatusException conflict(String message) { return new ResponseStatusException(HttpStatus.CONFLICT,message); }
}
