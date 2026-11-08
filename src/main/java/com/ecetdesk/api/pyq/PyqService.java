package com.ecetdesk.api.pyq;

import java.time.Duration;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PyqService {
    private static final Map<String,Integer> BLUEPRINT = Map.of(
        "DCME",100, "MATHEMATICS",50, "PHYSICS",30, "CHEMISTRY",20
    );
    private final JdbcTemplate jdbc;

    public PyqService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Transactional
    public Map<String,Object> createQuestion(QuestionRequest r) {
        if (r.options() == null || r.options().size() != 4 ||
            r.options().stream().filter(o -> Boolean.TRUE.equals(o.correct())).count() != 1)
            throw bad("Provide exactly four options and exactly one correct answer.");
        UUID id = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO pyq_questions(id,subject,topic,curriculum,question_text,explanation,source_year,
                source_paper,source_question_number,difficulty,verified,active)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,TRUE)
            """, id, r.subject(), trimOrNull(r.topic()), r.curriculum(), r.questionText().trim(),
            trimOrNull(r.explanation()), r.sourceYear(), r.sourcePaper().trim(), r.sourceQuestionNumber(),
            r.difficulty() == null ? "MEDIUM" : r.difficulty(), Boolean.TRUE.equals(r.verified()));
        char label = 'A';
        for (OptionRequest o : r.options()) {
            jdbc.update("INSERT INTO pyq_question_options(question_id,option_label,option_text,is_correct) VALUES (?,?,?,?)",
                id, String.valueOf(label++), o.text().trim(), o.correct());
        }
        return Map.of("id",id,"subject",r.subject(),"sourceYear",r.sourceYear(),"verified",Boolean.TRUE.equals(r.verified()));
    }

    @Transactional
    public List<Map<String,Object>> createQuestions(List<QuestionRequest> requests) {
        if (requests == null || requests.isEmpty() || requests.size() > 250)
            throw bad("Import between 1 and 250 questions per batch.");
        List<Map<String,Object>> created = new ArrayList<>();
        for (QuestionRequest request : requests) created.add(createQuestion(request));
        return created;
    }

    public List<Map<String,Object>> listQuestions(String subject, Integer year, boolean includeUnverified) {
        return jdbc.queryForList("""
            SELECT q.id,q.subject,q.topic,q.curriculum,q.question_text AS "questionText",
                   q.source_year AS "sourceYear",q.source_paper AS "sourcePaper",
                   q.source_question_number AS "sourceQuestionNumber",q.difficulty,q.verified,q.active,
                   (SELECT COUNT(*) FROM pyq_question_options o WHERE o.question_id=q.id) AS "optionCount"
            FROM pyq_questions q
            WHERE (CAST(? AS VARCHAR) IS NULL OR q.subject=?) AND (CAST(? AS INTEGER) IS NULL OR q.source_year=?)
              AND (? = TRUE OR q.verified=TRUE)
            ORDER BY q.source_year DESC,q.subject,q.created_at DESC
            """, subject,subject,year,year,includeUnverified);
    }

    @Transactional
    public Map<String,Object> createPaper(PaperRequest r) {
        UUID id=UUID.randomUUID();
        jdbc.update("""
            INSERT INTO pyq_papers(id,title,exam_year,branch,curriculum,paper_type,storage_path,public_url,source_name,attribution)
            VALUES (?,?,?,?,?,?,?,?,?,?)
            """,id,r.title().trim(),r.examYear(),r.branch(),r.curriculum(),r.paperType(),
            r.storagePath().trim(),trimOrNull(r.publicUrl()),trimOrNull(r.sourceName()),trimOrNull(r.attribution()));
        return Map.of("id",id,"title",r.title(),"examYear",r.examYear(),"paperType",r.paperType());
    }

    public List<Map<String,Object>> listPapers(String branch, String curriculum) {
        return jdbc.queryForList("""
            SELECT id,title,exam_year AS "examYear",branch,curriculum,paper_type AS "paperType",
                   storage_path AS "storagePath",public_url AS "publicUrl",source_name AS "sourceName",
                   attribution,created_at AS "createdAt"
            FROM pyq_papers WHERE active=TRUE AND (CAST(? AS VARCHAR) IS NULL OR branch=?) AND (CAST(? AS VARCHAR) IS NULL OR curriculum=?)
            ORDER BY exam_year DESC,paper_type,branch
            """,branch,branch,curriculum,curriculum);
    }

    public List<Map<String,Object>> listAdminPapers() {
        return jdbc.queryForList("""
            SELECT id,title,exam_year AS "examYear",branch,curriculum,paper_type AS "paperType",
                   storage_path AS "storagePath",public_url AS "publicUrl",source_name AS "sourceName",
                   attribution,active,created_at AS "createdAt"
            FROM pyq_papers ORDER BY exam_year DESC,paper_type,branch
            """);
    }

    @Transactional
    public Map<String,Object> setPaperActive(UUID paperId, boolean active) {
        int changed = jdbc.update("UPDATE pyq_papers SET active=? WHERE id=?",active,paperId);
        if (changed == 0) throw notFound("PYQ paper not found.");
        return Map.of("id",paperId,"active",active);
    }

    @Transactional
    public Map<String,Object> startAttempt(String email) {
        UUID student;
        try {
            student = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?) AND role='STUDENT'",UUID.class,email);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only student accounts can start the PYQ Challenge.");
        }
        Integer inProgress=jdbc.queryForObject("SELECT COUNT(*) FROM pyq_attempts WHERE student_id=? AND status='IN_PROGRESS'",Integer.class,student);
        if (inProgress != null && inProgress > 0) throw conflict("Finish or submit your existing PYQ Challenge before starting another.");
        for (var entry: BLUEPRINT.entrySet()) {
            Integer available=jdbc.queryForObject("""
                SELECT COUNT(*) FROM pyq_questions q
                WHERE q.subject=? AND q.curriculum='C23' AND q.verified=TRUE AND q.active=TRUE
                  AND (SELECT COUNT(*) FROM pyq_question_options o WHERE o.question_id=q.id)=4
                  AND (SELECT COUNT(*) FROM pyq_question_options o WHERE o.question_id=q.id AND o.is_correct=TRUE)=1
                """,Integer.class,entry.getKey());
            if (available == null || available < entry.getValue())
                throw conflict("The verified C23 PYQ bank needs at least "+entry.getValue()+" "+entry.getKey()+" questions; currently available: "+(available==null?0:available)+".");
        }

        UUID attempt=UUID.randomUUID();
        jdbc.update("INSERT INTO pyq_attempts(id,student_id) VALUES (?,?)",attempt,student);
        List<UUID> selected=new ArrayList<>();
        for (var entry: BLUEPRINT.entrySet()) {
            selected.addAll(jdbc.query("""
                SELECT q.id FROM pyq_questions q
                WHERE q.subject=? AND q.curriculum='C23' AND q.verified=TRUE AND q.active=TRUE
                  AND (SELECT COUNT(*) FROM pyq_question_options o WHERE o.question_id=q.id)=4
                  AND (SELECT COUNT(*) FROM pyq_question_options o WHERE o.question_id=q.id AND o.is_correct=TRUE)=1
                ORDER BY random() LIMIT ?
                """,(rs,row)->UUID.fromString(rs.getString(1)),entry.getKey(),entry.getValue()));
        }
        Collections.shuffle(selected);

        List<Object[]> questionBatch = new ArrayList<>(selected.size());
        for (int i = 0; i < selected.size(); i++) {
            questionBatch.add(new Object[]{attempt, selected.get(i), i + 1});
        }
        jdbc.batchUpdate("INSERT INTO pyq_attempt_questions(attempt_id,question_id,question_order) VALUES (?,?,?)", questionBatch);

        List<Map<String,Object>> optionRows = jdbc.queryForList("""
            SELECT id, question_id FROM pyq_question_options
            WHERE question_id IN (SELECT question_id FROM pyq_attempt_questions WHERE attempt_id=?)
            """, attempt);
        Map<UUID, List<UUID>> optionsByQ = new HashMap<>();
        for (var r : optionRows) {
            UUID qid = (UUID) r.get("question_id");
            UUID oid = (UUID) r.get("id");
            optionsByQ.computeIfAbsent(qid, k -> new ArrayList<>()).add(oid);
        }

        List<Object[]> optionBatch = new ArrayList<>();
        for (UUID qid : selected) {
            List<UUID> oids = optionsByQ.getOrDefault(qid, Collections.emptyList());
            Collections.shuffle(oids);
            int optionOrder = 1;
            for (UUID oid : oids) {
                optionBatch.add(new Object[]{attempt, qid, oid, optionOrder++});
            }
        }
        jdbc.batchUpdate("INSERT INTO pyq_attempt_options(attempt_id,question_id,option_id,option_order) VALUES (?,?,?,?)", optionBatch);

        return getAttempt(attempt,email);
    }

    public Map<String,Object> currentAttempt(String email) {
        List<Map<String,Object>> rows=jdbc.queryForList("""
            SELECT a.id FROM pyq_attempts a JOIN users u ON u.id=a.student_id
            WHERE lower(u.email)=lower(?) AND a.status='IN_PROGRESS'
            ORDER BY a.started_at DESC LIMIT 1
            """,email);
        if(rows.isEmpty()) return Map.of("active",false);
        UUID id=(UUID)rows.get(0).get("id");
        Map<String,Object> current=new LinkedHashMap<>(getAttempt(id,email));
        current.put("active",true);
        return current;
    }

    public Map<String,Object> getAttempt(UUID attemptId,String email) {
        Map<String,Object> a=ownedAttempt(attemptId,email);
        List<Map<String,Object>> questions=jdbc.queryForList("""
            SELECT q.id,q.subject,q.topic,q.question_text AS "questionText",
                   q.source_year AS "sourceYear",q.source_paper AS "sourcePaper",
                   aq.question_order AS "questionOrder"
            FROM pyq_attempt_questions aq JOIN pyq_questions q ON q.id=aq.question_id
            WHERE aq.attempt_id=? ORDER BY aq.question_order
            """,attemptId);

        List<Map<String,Object>> allOptions = jdbc.queryForList("""
            SELECT ao.question_id AS "questionId", o.id, chr(64+ao.option_order) AS label, o.option_text AS text
            FROM pyq_attempt_options ao JOIN pyq_question_options o ON o.id=ao.option_id
            WHERE ao.attempt_id=? ORDER BY ao.question_id, ao.option_order
            """, attemptId);
        Map<Object, List<Map<String,Object>>> optionsByQuestion = new HashMap<>();
        for (var opt : allOptions) {
            Object qId = opt.remove("questionId");
            optionsByQuestion.computeIfAbsent(qId, k -> new ArrayList<>()).add(opt);
        }

        List<Map<String,Object>> allAnswers = jdbc.queryForList("""
            SELECT question_id AS "questionId", selected_option_id AS "selectedOptionId"
            FROM pyq_student_answers WHERE attempt_id=?
            """, attemptId);
        Map<Object, Object> answersByQuestion = new HashMap<>();
        for (var ans : allAnswers) {
            answersByQuestion.put(ans.get("questionId"), ans.get("selectedOptionId"));
        }

        for (var q : questions) {
            Object qId = q.get("id");
            q.put("options", optionsByQuestion.getOrDefault(qId, Collections.emptyList()));
            q.put("selectedOptionId", answersByQuestion.get(qId));
        }

        Map<String,Object> result=new LinkedHashMap<>();
        result.put("attemptId",attemptId);result.put("status",a.get("status"));
        result.put("startedAt",a.get("started_at"));result.put("durationMinutes",a.get("duration_minutes"));
        result.put("questions",questions);
        return result;
    }

    @Transactional
    public Map<String,Object> saveAnswer(UUID attemptId,UUID questionId,UUID optionId,String email) {
        Map<String,Object> a=ownedAttempt(attemptId,email);
        ensureInProgress(a);
        ensureWithinTime(a);
        Integer valid=jdbc.queryForObject("""
            SELECT COUNT(*) FROM pyq_attempt_options
            WHERE attempt_id=? AND question_id=? AND option_id=?
            """,Integer.class,attemptId,questionId,optionId);
        if(valid==null || valid==0) throw bad("That option does not belong to this question in this attempt.");
        jdbc.update("""
            INSERT INTO pyq_student_answers(attempt_id,question_id,selected_option_id,answered_at)
            VALUES (?,?,?,CURRENT_TIMESTAMP)
            ON CONFLICT(attempt_id,question_id) DO UPDATE
            SET selected_option_id=EXCLUDED.selected_option_id,answered_at=CURRENT_TIMESTAMP,is_correct=NULL
            """,attemptId,questionId,optionId);
        return Map.of("saved",true,"questionId",questionId);
    }

    @Transactional
    public Map<String,Object> submit(UUID attemptId,String email) {
        Map<String,Object> a=ownedAttempt(attemptId,email);
        if(!"IN_PROGRESS".equals(a.get("status"))) throw conflict("This attempt has already been submitted.");
        Integer total=jdbc.queryForObject("SELECT COUNT(*) FROM pyq_attempt_questions WHERE attempt_id=?",Integer.class,attemptId);
        Integer answered=jdbc.queryForObject("SELECT COUNT(*) FROM pyq_student_answers WHERE attempt_id=? AND selected_option_id IS NOT NULL",Integer.class,attemptId);
        Integer correct=jdbc.queryForObject("""
            SELECT COUNT(*) FROM pyq_student_answers sa
            JOIN pyq_question_options o ON o.id=sa.selected_option_id
            WHERE sa.attempt_id=? AND o.is_correct=TRUE
            """,Integer.class,attemptId);
        int t=total==null?0:total, an=answered==null?0:answered, c=correct==null?0:correct;
        int incorrect=an-c, unanswered=t-an;
        long elapsed=getElapsedSeconds(attemptId);
        String status=elapsed>=(long)((Number)a.get("duration_minutes")).intValue()*60?"TIMED_OUT":"SUBMITTED";
        jdbc.update("""
            UPDATE pyq_student_answers sa SET is_correct=o.is_correct
            FROM pyq_question_options o WHERE o.id=sa.selected_option_id AND sa.attempt_id=?
            """,attemptId);
        jdbc.update("""
            UPDATE pyq_attempts SET status=?,submitted_at=CURRENT_TIMESTAMP,score=?,correct_count=?,
                incorrect_count=?,unanswered_count=? WHERE id=?
            """,status,c,c,incorrect,unanswered,attemptId);
        return Map.of("attemptId",attemptId,"status",status,"score",c,"totalMarks",t,
            "correctCount",c,"incorrectCount",incorrect,"unansweredCount",unanswered,"elapsedSeconds",elapsed);
    }

    public List<Map<String,Object>> studentResults(String email) {
        return jdbc.queryForList("""
            SELECT a.id AS "attemptId",a.status,a.score,a.total_questions AS "totalQuestions",
                a.correct_count AS "correctCount",a.incorrect_count AS "incorrectCount",
                a.unanswered_count AS "unansweredCount",a.started_at AS "startedAt",a.submitted_at AS "submittedAt"
            FROM pyq_attempts a JOIN users u ON u.id=a.student_id
            WHERE lower(u.email)=lower(?) ORDER BY a.started_at DESC
            """,email);
    }

    public List<Map<String,Object>> adminAttempts() {
        return jdbc.queryForList("""
            SELECT a.id AS "attemptId",u.id AS "studentId",u.display_name AS "studentName",
                u.email AS "studentEmail",a.status,a.score,a.total_questions AS "totalQuestions",
                a.correct_count AS "correctCount",a.incorrect_count AS "incorrectCount",
                a.unanswered_count AS "unansweredCount",a.started_at AS "startedAt",a.submitted_at AS "submittedAt"
            FROM pyq_attempts a JOIN users u ON u.id=a.student_id
            ORDER BY a.started_at DESC
            """);
    }

    public Map<String,Object> adminReview(UUID attemptId) {
        Map<String,Object> a;
        try { a=jdbc.queryForMap("""
            SELECT a.id AS "attemptId",a.status,a.score,a.total_questions AS "totalQuestions",
                a.correct_count AS "correctCount",a.incorrect_count AS "incorrectCount",
                a.unanswered_count AS "unansweredCount",a.started_at AS "startedAt",a.submitted_at AS "submittedAt",
                u.display_name AS "studentName",u.email AS "studentEmail"
            FROM pyq_attempts a JOIN users u ON u.id=a.student_id WHERE a.id=?
            """,attemptId); } catch(Exception ex) { throw notFound("PYQ attempt not found."); }
        a.put("questions",jdbc.queryForList("""
            SELECT q.id AS "questionId",aq.question_order AS "questionOrder",q.subject,q.topic,
                q.source_year AS "sourceYear",q.source_paper AS "sourcePaper",q.question_text AS "questionText",
                sa.selected_option_id AS "selectedOptionId",
                (SELECT id FROM pyq_question_options WHERE question_id=q.id AND is_correct=TRUE) AS "correctOptionId",
                (SELECT option_text FROM pyq_question_options WHERE question_id=q.id AND is_correct=TRUE) AS "correctOptionText",
                (SELECT option_text FROM pyq_question_options WHERE id=sa.selected_option_id) AS "selectedOptionText",
                COALESCE((SELECT is_correct FROM pyq_question_options WHERE id=sa.selected_option_id),FALSE) AS "isCorrect"
            FROM pyq_attempt_questions aq JOIN pyq_questions q ON q.id=aq.question_id
            LEFT JOIN pyq_student_answers sa ON sa.attempt_id=aq.attempt_id AND sa.question_id=aq.question_id
            WHERE aq.attempt_id=? ORDER BY aq.question_order
            """,attemptId));
        return a;
    }

    private Map<String,Object> ownedAttempt(UUID attemptId,String email) {
        try { return jdbc.queryForMap("""
            SELECT a.* FROM pyq_attempts a JOIN users u ON u.id=a.student_id
            WHERE a.id=? AND lower(u.email)=lower(?)
            """,attemptId,email); }
        catch(Exception ex) { throw notFound("PYQ attempt not found."); }
    }
    private void ensureInProgress(Map<String,Object> a) {
        if(!"IN_PROGRESS".equals(a.get("status"))) throw conflict("This attempt is no longer active.");
    }
    private void ensureWithinTime(Map<String,Object> a) {
        long seconds=getElapsedSeconds((UUID) a.get("id"));
        if(seconds>=((long)((Number)a.get("duration_minutes")).intValue())*60)
            throw conflict("The 180-minute PYQ Challenge time limit has expired.");
    }
    private long getElapsedSeconds(UUID attemptId) {
        Long elapsed = jdbc.queryForObject(
            "SELECT EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::BIGINT FROM pyq_attempts WHERE id = ?",
            Long.class, attemptId);
        return elapsed == null ? 0L : elapsed;
    }
    private static String trimOrNull(String s){return s==null||s.isBlank()?null:s.trim();}
    private static ResponseStatusException bad(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
    private static ResponseStatusException conflict(String m){return new ResponseStatusException(HttpStatus.CONFLICT,m);}
    private static ResponseStatusException notFound(String m){return new ResponseStatusException(HttpStatus.NOT_FOUND,m);}

    public record OptionRequest(String text,Boolean correct) {}
    public record QuestionRequest(String subject,String topic,String curriculum,String questionText,String explanation,
        Integer sourceYear,String sourcePaper,Integer sourceQuestionNumber,String difficulty,Boolean verified,List<OptionRequest> options) {}
    public record PaperRequest(String title,Integer examYear,String branch,String curriculum,String paperType,
        String storagePath,String publicUrl,String sourceName,String attribution) {}
}
