package com.ecetdesk.api.assessment;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
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
    public void deleteTest(UUID testId) {
        Integer attempts = jdbc.queryForObject("SELECT COUNT(*) FROM test_attempts WHERE test_id=?", Integer.class, testId);
        if (attempts != null && attempts > 0) {
            throw conflict("Cannot delete a test that already has student attempts.");
        }
        jdbc.update("DELETE FROM test_questions WHERE test_id=?", testId);
        jdbc.update("DELETE FROM test_subject_allocations WHERE test_id=?", testId);
        jdbc.update("DELETE FROM tests WHERE id=?", testId);
    }

    public Map<String, Object> autoGenerateTest(AssessmentController.AutoGenerateTestRequest r, String adminEmail) {
        String type = r.testType();
        if (!BLUEPRINTS.containsKey(type)) {
            throw bad("Invalid test type. Must be DAILY or GRAND.");
        }

        UUID adminId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, adminEmail);
        LocalDate scheduledDate = null;
        String title;
        int count = "GRAND".equals(type) ? 200 : 50;
        int duration = "GRAND".equals(type) ? 180 : 0;

        if ("DAILY".equals(type)) {
            if (r.scheduledDate() != null && !r.scheduledDate().isBlank()) {
                try {
                    scheduledDate = LocalDate.parse(r.scheduledDate().trim());
                } catch (Exception ex) {
                    throw bad("scheduledDate must use YYYY-MM-DD.");
                }
            } else {
                scheduledDate = LocalDate.now(ZoneId.of("Asia/Kolkata"));
            }

            List<Map<String, Object>> existing = jdbc.queryForList(
                "SELECT id, title, status FROM tests WHERE test_type='DAILY' AND scheduled_date=?", scheduledDate);
            if (!existing.isEmpty()) {
                UUID existingId = (UUID) existing.get(0).get("id");
                Integer attempts = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM test_attempts WHERE test_id=?", Integer.class, existingId);
                if (attempts != null && attempts > 0) {
                    throw conflict("A daily mock for " + scheduledDate + " already exists and has active student attempts. Cannot regenerate.");
                }
                deleteTest(existingId);
            }

            title = (r.customTitle() != null && !r.customTitle().isBlank())
                ? r.customTitle().trim()
                : "Daily Mock - " + scheduledDate;
        } else {
            if (r.customTitle() != null && !r.customTitle().isBlank()) {
                title = r.customTitle().trim();
            } else {
                Integer existingCount = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM tests WHERE test_type='GRAND'", Integer.class);
                title = "Grand Mock Test #" + ((existingCount == null ? 0 : existingCount) + 1) + " - Full Syllabus";
            }
        }

        UUID testId = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO tests(id, title, test_type, status, scheduled_date, question_count, duration_minutes, total_marks, created_by)
            VALUES (?, ?, ?, 'DRAFT', ?, ?, ?, ?, ?)
            """, testId, title, type, scheduledDate, count, duration, count, adminId);

        BLUEPRINTS.get(type).forEach((subject, amount) ->
            jdbc.update("INSERT INTO test_subject_allocations(test_id, subject, question_count) VALUES (?, ?, ?)", testId, subject, amount));

        Map<String, Integer> blueprint = BLUEPRINTS.get(type);
        Map<String, List<OpenRouterQuestionGenerator.GeneratedQuestion>> generatedBySubjectList = new ConcurrentHashMap<>();
        Map<String, Integer> generatedCounts = new ConcurrentHashMap<>();

        List<CompletableFuture<Void>> futures = blueprint.entrySet().stream()
            .map(entry -> CompletableFuture.runAsync(() -> {
                String subject = entry.getKey();
                int target = entry.getValue();
                List<OpenRouterQuestionGenerator.GeneratedQuestion> generated =
                    generator.generate(subject, target, r.instructions());
                generatedBySubjectList.put(subject, generated);
                generatedCounts.put(subject, generated.size());
            }))
            .toList();

        try {
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        } catch (Exception ex) {
            try { deleteTest(testId); } catch (Exception ignored) {}
            Throwable cause = ex.getCause() != null ? ex.getCause() : ex;
            if (cause instanceof ResponseStatusException rse) {
                throw rse;
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed generating test questions: " + cause.getMessage(), cause);
        }

        int added = persistGeneratedQuestions(testId, generatedBySubjectList);
        publish(testId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", testId);
        response.put("title", title);
        response.put("testType", type);
        response.put("status", "PUBLISHED");
        response.put("scheduledDate", scheduledDate == null ? "" : scheduledDate.toString());
        response.put("questionCount", count);
        response.put("durationMinutes", duration);
        response.put("totalMarks", count);
        response.put("questionsAdded", added);
        response.put("generatedBySubject", generatedCounts);
        response.put("message", "Successfully generated and published " + title + " with " + count + " questions!");
        return response;
    }

    public List<Map<String,Object>> listAllTestsForAdmin() {
        return jdbc.queryForList("""
            SELECT id, title, test_type AS "testType", status, scheduled_date AS "scheduledDate",
                   question_count AS "questionCount", duration_minutes AS "durationMinutes",
                   total_marks AS "totalMarks", created_at AS "createdAt", published_at AS "publishedAt"
            FROM tests
            ORDER BY created_at DESC
            """);
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

    public Map<String,Object> getAdminTest(UUID testId) {
        Map<String,Object> test = test(testId);
        List<Map<String,Object>> questions = jdbc.queryForList("""
            SELECT q.id,q.subject,q.question_text AS "questionText",q.explanation,q.difficulty,
                   tq.question_order AS "questionOrder"
            FROM test_questions tq JOIN questions q ON q.id=tq.question_id
            WHERE tq.test_id=? ORDER BY tq.question_order
            """,testId);
        for (var question : questions) {
            question.put("options",jdbc.queryForList("""
                SELECT id,option_label AS label,option_text AS text,is_correct AS correct
                FROM question_options WHERE question_id=? ORDER BY option_label
                """,question.get("id")));
        }
        Map<String,Object> result=new LinkedHashMap<>(test);
        result.put("questions",questions);
        result.put("subjectAllocations",jdbc.queryForList(
            "SELECT subject,question_count AS \"questionCount\" FROM test_subject_allocations WHERE test_id=?",testId));
        return result;
    }

    @Transactional
    public Map<String,Object> addQuestion(UUID testId, UUID questionId) {
        Map<String,Object> test = test(testId);
        if (!"DRAFT".equals(test.get("status"))) throw conflict("Questions can only be added to a draft test.");
        Integer order = jdbc.queryForObject("SELECT COALESCE(MAX(question_order),0)+1 FROM test_questions WHERE test_id=?",Integer.class,testId);
        jdbc.update("INSERT INTO test_questions(test_id,question_id,question_order,marks) VALUES (?,?,?,1)",testId,questionId,order);
        return Map.of("testId",testId,"questionId",questionId,"questionOrder",order);
    }

    public Map<String,Object> generateQuestions(UUID testId, String instructions) {
        Map<String,Object> test = test(testId);
        if (!"DRAFT".equals(test.get("status")))
            throw conflict("AI questions can only be generated for a draft test.");

        String type = (String)test.get("test_type");
        Map<String,Integer> blueprint = BLUEPRINTS.get(type);
        if (blueprint == null) throw bad("Unsupported test type.");

        Map<String, List<OpenRouterQuestionGenerator.GeneratedQuestion>> generatedBySubjectList = new LinkedHashMap<>();
        Map<String, Integer> generatedCounts = new LinkedHashMap<>();

        // Fetch AI questions outside DB transaction to avoid connection starvation on cloud
        for (var allocation : blueprint.entrySet()) {
            String subject = allocation.getKey();
            int target = allocation.getValue();
            Integer existing = jdbc.queryForObject("""
                SELECT COUNT(*) FROM test_questions tq
                JOIN questions q ON q.id=tq.question_id
                WHERE tq.test_id=? AND q.subject=?
                """, Integer.class, testId, subject);
            int missing = target - (existing == null ? 0 : existing);
            if (missing < 0)
                throw bad(subject + " already has more questions than the test blueprint allows.");

            if (missing > 0) {
                List<OpenRouterQuestionGenerator.GeneratedQuestion> generated =
                    generator.generate(subject, missing, instructions);
                generatedBySubjectList.put(subject, generated);
                generatedCounts.put(subject, generated.size());
            } else {
                generatedCounts.put(subject, 0);
            }
        }

        int added = persistGeneratedQuestions(testId, generatedBySubjectList);

        return Map.of(
            "testId", testId,
            "status", "DRAFT",
            "questionsAdded", added,
            "generatedBySubject", generatedCounts,
            "message", "Generated questions remain in draft status. Review them before publishing."
        );
    }

    @Transactional
    public int persistGeneratedQuestions(UUID testId, Map<String, List<OpenRouterQuestionGenerator.GeneratedQuestion>> generated) {
        Integer nextOrder = jdbc.queryForObject(
            "SELECT COALESCE(MAX(question_order),0)+1 FROM test_questions WHERE test_id=?",
            Integer.class, testId);
        int added = 0;
        for (var entry : generated.entrySet()) {
            String subject = entry.getKey();
            for (var question : entry.getValue()) {
                UUID questionId = UUID.randomUUID();
                jdbc.update("""
                    INSERT INTO questions(id,subject,question_text,explanation,difficulty)
                    VALUES (?,?,?,?,?)
                    """, questionId, subject, question.questionText(),
                    question.explanation(), question.difficulty());

                char label = 'A';
                for (var option : question.options()) {
                    jdbc.update("""
                        INSERT INTO question_options(id,question_id,option_label,option_text,is_correct)
                        VALUES (?,?,?,?,?)
                        """, UUID.randomUUID(), questionId, String.valueOf(label++),
                        option.text(), option.correct());
                }

                jdbc.update("""
                    INSERT INTO test_questions(test_id,question_id,question_order,marks)
                    VALUES (?,?,?,1)
                    """, testId, questionId, nextOrder++);
                added++;
            }
        }
        return added;
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
            FROM tests WHERE status='PUBLISHED' AND (test_type='GRAND' OR scheduled_date=?)
            ORDER BY published_at DESC
            """,LocalDate.now(ZoneId.of("Asia/Kolkata")));
    }

    @Transactional
    public Map<String,Object> startAttempt(UUID testId, String email) {
        Map<String,Object> test = test(testId);
        if (!"PUBLISHED".equals(test.get("status"))) throw conflict("This test is not available.");
        if ("DAILY".equals(test.get("test_type")) && !LocalDate.now(ZoneId.of("Asia/Kolkata")).equals(((java.sql.Date)test.get("scheduled_date")).toLocalDate()))
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
        checkAttemptTimeLimit(attempt);
        Integer valid = jdbc.queryForObject("""
            SELECT COUNT(*) FROM test_questions tq JOIN question_options qo ON qo.question_id=tq.question_id
            WHERE tq.test_id=? AND tq.question_id=? AND qo.id=?
            """,Integer.class,attempt.get("test_id"),questionId,optionId);
        if (valid == null || valid != 1) throw bad("The selected option does not belong to this test question.");
        jdbc.update("""
            INSERT INTO student_answers(attempt_id,question_id,selected_option_id,answered_at)
            VALUES (?,?,?,CURRENT_TIMESTAMP) ON CONFLICT (attempt_id,question_id)
            DO UPDATE SET selected_option_id=EXCLUDED.selected_option_id,answered_at=CURRENT_TIMESTAMP
            """,attemptId,questionId,optionId);
        return Map.of("saved",true,"questionId",questionId);
    }

    @Transactional
    public Map<String,Object> submit(UUID attemptId, String email) {
        Map<String,Object> attempt = ownedAttempt(attemptId,email);
        if (!"IN_PROGRESS".equals(attempt.get("status"))) throw conflict("This attempt has already been submitted.");

        String attemptStatus = "SUBMITTED";
        Number duration = (Number) attempt.get("duration_minutes");
        if (duration != null && duration.intValue() > 0) {
            java.sql.Timestamp startedAt = (java.sql.Timestamp) attempt.get("started_at");
            if (startedAt != null) {
                long maxDurationMillis = (duration.intValue() + 2) * 60 * 1000L;
                if (System.currentTimeMillis() - startedAt.getTime() > maxDurationMillis) {
                    attemptStatus = "TIMED_OUT";
                }
            }
        }

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
            UPDATE test_attempts SET status=?,submitted_at=CURRENT_TIMESTAMP,
              score=?,correct_count=?,incorrect_count=?,unanswered_count=? WHERE id=?
            """,attemptStatus,correct,correct,incorrect,unanswered,attemptId);
        Map<String,Object> timing = jdbc.queryForMap("SELECT started_at,submitted_at,EXTRACT(EPOCH FROM (submitted_at-started_at))::BIGINT AS elapsed_seconds FROM test_attempts WHERE id=?",attemptId);
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("attemptId",attemptId);result.put("status",attemptStatus);result.put("score",correct);
        result.put("totalMarks",total);result.put("correct",correct);result.put("incorrect",incorrect);
        result.put("unanswered",unanswered);result.put("startedAt",timing.get("started_at"));
        result.put("submittedAt",timing.get("submitted_at"));result.put("elapsedSeconds",timing.get("elapsed_seconds"));
        return result;
    }

    public List<Map<String,Object>> myResults(String email) {
        return jdbc.queryForList("""
            SELECT a.id AS \"attemptId\",t.title,t.test_type AS \"testType\",a.status,a.score,
              a.correct_count AS correct,a.incorrect_count AS incorrect,a.unanswered_count AS unanswered,
              a.started_at AS \"startedAt\",a.submitted_at AS \"submittedAt\",
              CASE WHEN a.submitted_at IS NULL THEN NULL ELSE EXTRACT(EPOCH FROM (a.submitted_at-a.started_at))::BIGINT END AS \"elapsedSeconds\"
            FROM test_attempts a JOIN tests t ON t.id=a.test_id
            WHERE a.student_id=? AND a.status IN ('SUBMITTED', 'TIMED_OUT') ORDER BY a.submitted_at DESC
            """,studentId(email));
    }

    public Map<String,Object> getAttemptReview(UUID attemptId, String email, boolean wrongOnly) {
        boolean isAdmin = isUserAdmin(email);
        Map<String,Object> attempt;
        if (isAdmin) {
            List<Map<String,Object>> rows = jdbc.queryForList("""
                SELECT a.*, t.title, t.test_type AS "testType", t.total_marks AS "totalMarks",
                       u.email AS "studentEmail", u.display_name AS "studentDisplayName"
                FROM test_attempts a
                JOIN tests t ON t.id = a.test_id
                JOIN users u ON u.id = a.student_id
                WHERE a.id = ?
                """, attemptId);
            if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Attempt not found.");
            attempt = rows.get(0);
        } else {
            UUID student = studentId(email);
            List<Map<String,Object>> rows = jdbc.queryForList("""
                SELECT a.*, t.title, t.test_type AS "testType", t.total_marks AS "totalMarks",
                       u.email AS "studentEmail", u.display_name AS "studentDisplayName"
                FROM test_attempts a
                JOIN tests t ON t.id = a.test_id
                JOIN users u ON u.id = a.student_id
                WHERE a.id = ? AND a.student_id = ?
                """, attemptId, student);
            if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Attempt not found.");
            attempt = rows.get(0);
        }

        String status = (String) attempt.get("status");
        if ("IN_PROGRESS".equals(status)) {
            throw conflict("Review with answers and explanations is only available after submitting the test.");
        }

        UUID testId = (UUID) attempt.get("test_id");
        List<Map<String,Object>> questions = jdbc.queryForList("""
            SELECT q.id, q.subject, q.question_text AS "questionText", q.explanation, q.difficulty,
                   tq.question_order AS "questionOrder",
                   sa.selected_option_id AS "selectedOptionId",
                   sa.is_correct AS "isCorrect"
            FROM test_questions tq
            JOIN questions q ON q.id = tq.question_id
            LEFT JOIN student_answers sa ON sa.attempt_id = ? AND sa.question_id = q.id
            WHERE tq.test_id = ?
            ORDER BY tq.question_order
            """, attemptId, testId);

        List<Map<String,Object>> questionReviews = new ArrayList<>();

        for (var q : questions) {
            UUID qId = (UUID) q.get("id");
            UUID selectedOptionId = (UUID) q.get("selectedOptionId");
            Boolean isCorrect = (Boolean) q.get("isCorrect");

            List<Map<String,Object>> options = jdbc.queryForList("""
                SELECT id, option_label AS label, option_text AS text, is_correct AS correct
                FROM question_options
                WHERE question_id = ?
                ORDER BY option_label
                """, qId);

            Map<String,Object> selectedOption = null;
            Map<String,Object> correctOption = null;
            for (var opt : options) {
                if (Boolean.TRUE.equals(opt.get("correct"))) {
                    correctOption = opt;
                }
                if (selectedOptionId != null && selectedOptionId.equals(opt.get("id"))) {
                    selectedOption = opt;
                }
            }

            String questionStatus;
            boolean isWrong;
            if (selectedOptionId == null) {
                questionStatus = "UNANSWERED";
                isWrong = true;
            } else if (Boolean.TRUE.equals(isCorrect)) {
                questionStatus = "CORRECT";
                isWrong = false;
            } else {
                questionStatus = "INCORRECT";
                isWrong = true;
            }

            Map<String,Object> qReview = new LinkedHashMap<>();
            qReview.put("questionId", qId);
            qReview.put("questionOrder", q.get("questionOrder"));
            qReview.put("subject", q.get("subject"));
            qReview.put("questionText", q.get("questionText"));
            qReview.put("difficulty", q.get("difficulty"));
            qReview.put("explanation", q.get("explanation"));
            qReview.put("resultStatus", questionStatus);
            qReview.put("isWrong", isWrong);
            qReview.put("selectedOptionId", selectedOptionId);
            qReview.put("selectedOptionLabel", selectedOption == null ? null : selectedOption.get("label"));
            qReview.put("selectedOptionText", selectedOption == null ? null : selectedOption.get("text"));
            qReview.put("correctOptionId", correctOption == null ? null : correctOption.get("id"));
            qReview.put("correctOptionLabel", correctOption == null ? null : correctOption.get("label"));
            qReview.put("correctOptionText", correctOption == null ? null : correctOption.get("text"));
            qReview.put("options", options);

            if (!wrongOnly || isWrong) {
                questionReviews.add(qReview);
            }
        }

        Map<String,Object> result = new LinkedHashMap<>();
        result.put("attemptId", attemptId);
        result.put("testId", testId);
        result.put("testTitle", attempt.get("title"));
        result.put("testType", attempt.get("testType"));
        result.put("status", attempt.get("status"));
        result.put("studentDisplayName", attempt.get("studentDisplayName"));
        result.put("studentEmail", attempt.get("studentEmail"));
        result.put("score", attempt.get("score"));
        result.put("totalMarks", attempt.get("totalMarks"));
        result.put("correctCount", attempt.get("correct_count"));
        result.put("incorrectCount", attempt.get("incorrect_count"));
        result.put("unansweredCount", attempt.get("unanswered_count"));
        result.put("startedAt", attempt.get("started_at"));
        result.put("submittedAt", attempt.get("submitted_at"));

        Object submittedAt = attempt.get("submitted_at");
        Object startedAt = attempt.get("started_at");
        if (submittedAt != null && startedAt != null) {
            Long elapsed = jdbc.queryForObject(
                "SELECT EXTRACT(EPOCH FROM (submitted_at - started_at))::BIGINT FROM test_attempts WHERE id = ?",
                Long.class, attemptId);
            result.put("elapsedSeconds", elapsed);
        } else {
            result.put("elapsedSeconds", null);
        }

        result.put("totalQuestions", questions.size());
        result.put("reviewedQuestionsCount", questionReviews.size());
        result.put("wrongOnlyFilter", wrongOnly);
        result.put("questions", questionReviews);

        return result;
    }

    public List<Map<String,Object>> getTestAttemptsForAdmin(UUID testId) {
        test(testId);
        return jdbc.queryForList("""
            SELECT a.id AS "attemptId", a.student_id AS "studentId", u.email AS "studentEmail",
                   u.display_name AS "studentDisplayName", a.status, a.score, t.total_marks AS "totalMarks",
                   a.correct_count AS "correctCount", a.incorrect_count AS "incorrectCount",
                   a.unanswered_count AS "unansweredCount",
                   a.started_at AS "startedAt", a.submitted_at AS "submittedAt",
                   CASE WHEN a.submitted_at IS NULL THEN NULL ELSE EXTRACT(EPOCH FROM (a.submitted_at - a.started_at))::BIGINT END AS "elapsedSeconds"
            FROM test_attempts a
            JOIN users u ON u.id = a.student_id
            JOIN tests t ON t.id = a.test_id
            WHERE a.test_id = ?
            ORDER BY a.score DESC NULLS LAST, a.submitted_at ASC
            """, testId);
    }

    public List<Map<String,Object>> getStudentAttemptsForAdmin(UUID studentId) {
        return jdbc.queryForList("""
            SELECT a.id AS "attemptId", a.test_id AS "testId", t.title, t.test_type AS "testType",
                   a.status, a.score, t.total_marks AS "totalMarks",
                   a.correct_count AS "correctCount", a.incorrect_count AS "incorrectCount",
                   a.unanswered_count AS "unansweredCount",
                   a.started_at AS "startedAt", a.submitted_at AS "submittedAt",
                   CASE WHEN a.submitted_at IS NULL THEN NULL ELSE EXTRACT(EPOCH FROM (a.submitted_at - a.started_at))::BIGINT END AS "elapsedSeconds"
            FROM test_attempts a
            JOIN tests t ON t.id = a.test_id
            WHERE a.student_id = ?
            ORDER BY a.started_at DESC
            """, studentId);
    }

    public List<Map<String,Object>> getLeaderboard() {
        return jdbc.queryForList("""
            SELECT u.id AS "studentId", u.display_name AS "displayName", u.email AS "email",
                   COUNT(a.id) FILTER (WHERE a.status IN ('SUBMITTED', 'TIMED_OUT')) AS "testsCompleted",
                   COALESCE(SUM(a.score) FILTER (WHERE a.status IN ('SUBMITTED', 'TIMED_OUT')), 0) AS "totalScore",
                   COALESCE(ROUND(AVG(a.score) FILTER (WHERE a.status IN ('SUBMITTED', 'TIMED_OUT')), 2), 0) AS "averageScore",
                   COALESCE(SUM(a.correct_count) FILTER (WHERE a.status IN ('SUBMITTED', 'TIMED_OUT')), 0) AS "totalCorrect",
                   COALESCE(SUM(a.incorrect_count) FILTER (WHERE a.status IN ('SUBMITTED', 'TIMED_OUT')), 0) AS "totalIncorrect"
            FROM users u
            LEFT JOIN test_attempts a ON a.student_id = u.id
            WHERE u.role = 'STUDENT'
            GROUP BY u.id, u.display_name, u.email
            ORDER BY "totalScore" DESC, "averageScore" DESC
            """);
    }

    private void checkAttemptTimeLimit(Map<String,Object> attempt) {
        Number duration = (Number) attempt.get("duration_minutes");
        if (duration != null && duration.intValue() > 0) {
            java.sql.Timestamp startedAt = (java.sql.Timestamp) attempt.get("started_at");
            if (startedAt != null) {
                long maxDurationMillis = (duration.intValue() + 2) * 60 * 1000L;
                if (System.currentTimeMillis() - startedAt.getTime() > maxDurationMillis) {
                    throw conflict("The time limit for this test has expired (" + duration + " minutes). Please submit your test.");
                }
            }
        }
    }

    private boolean isUserAdmin(String email) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM users WHERE lower(email)=lower(?) AND role='ADMIN'",
            Integer.class, email);
        return count != null && count > 0;
    }

    private Map<String,Object> ownedAttempt(UUID id,String email) {
        List<Map<String,Object>> rows=jdbc.queryForList("""
            SELECT a.*, t.duration_minutes, t.test_type
            FROM test_attempts a
            JOIN tests t ON t.id = a.test_id
            WHERE a.id=? AND a.student_id=?
            """,id,studentId(email));
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
