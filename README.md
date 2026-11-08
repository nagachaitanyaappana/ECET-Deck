# Paradox — ECET Practice Platform

A private ECET practice platform for a small group of DCME students.

## Public identity

**Paradox** is the creator's chosen public alias and the product's public-facing identity. Use **Paradox** in the app's branding, UI, documentation, and public-facing project credits. Do not display or introduce the creator's personal name in the UI or public-facing copy.

Tagline: **Prepare. Practice. Progress.**

The application may use contextual labels such as **Paradox | ECET Preparation**, while keeping **Paradox** as the primary brand.

## Current status
- Spring Boot 3.5 / Java 21
- Maven Wrapper (Maven 3.9.11; no global Maven installation required)
- PostgreSQL connectivity from a workspace-root `.env` file
- Flyway-managed `app` schema and initial `app.users` table
- Health endpoint: `GET /api/v1/health`

JWT authentication, public student self-registration, role-protected student management, first-admin bootstrap, AI-assisted assessment creation, student attempts, automatic grading, and private result APIs are implemented.

## Requirements
- JDK 21 (a newer compatible JDK can also work)
- PostgreSQL database
- A workspace-root `.env` file with database and JWT settings

## Configure the workspace .env file
1. In the repository root (the same folder as `pom.xml`), copy `.env.example` to a new file named `.env`.
2. Open `.env` and fill in your Supabase Session Pooler details.

Example:

```properties
DB_URL=jdbc:postgresql://YOUR_SESSION_POOLER_HOST:5432/postgres?sslmode=require
DB_USERNAME=YOUR_SUPABASE_POOLER_USERNAME
DB_PASSWORD=YOUR_SUPABASE_DATABASE_PASSWORD
JWT_SECRET_BASE64=REPLACE_WITH_RANDOM_BASE64_SECRET
JWT_ACCESS_TOKEN_MINUTES=720
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
OPENROUTER_MODEL=openai/gpt-4o-mini
BOOTSTRAP_ADMIN_EMAIL=admin@example.com
BOOTSTRAP_ADMIN_PASSWORD=REPLACE_WITH_A_LONG_RANDOM_PASSWORD
BOOTSTRAP_ADMIN_NAME=ECET Desk Admin
```

Use the exact host and username shown by Supabase under **Connect → Session pooler**. Do not add quotes around the values. Keep all secrets private.

Generate the JWT signing secret in PowerShell (run once):

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Paste the output as `JWT_SECRET_BASE64`. Set a strong, unique bootstrap admin password of at least 12 characters. The first startup creates the admin only if no admin exists. After confirming the first admin can log in, remove the three `BOOTSTRAP_ADMIN_*` entries from `.env`. Never put these values in source control or share them.

Spring Boot loads this file from the process working directory using its config import support. Start Maven from the repository root so it finds the workspace `.env` file.

### Git safety
The root `.gitignore` ignores `.env` and other `.env.*` files, while allowing the placeholder-only `.env.example`.

Verify that your real file is ignored:

```powershell
git check-ignore .env
```

The command should print `.env`. Never force-add the real `.env` file.

## Run on Windows (PowerShell)

### 1. Run the Backend (Spring Boot API):
From the repository root:

```powershell
.\\mvnw.cmd spring-boot:run
```

To run tests:
```powershell
.\\mvnw.cmd test
```

### 2. Run the Frontend App (Android & Desktop):
Open a second terminal:

```powershell
cd frontend
npm run dev
```

- **Desktop access:** Open `http://localhost:3000` in any browser.
- **Android phone access:** Open the Network address displayed by Vite (e.g. `http://192.168.1.x:3000`) on your phone browser. In Chrome on Android, tap the menu (⋮) -> **"Add to Home screen"** or **"Install App"** to use it as a full-screen native-like app!

The first successful backend startup runs Flyway migrations and creates the `app` schema, users table, and assessment tables. If bootstrap variables are set and no admin exists, it creates the first ADMIN account.

## Authentication API

First-admin bootstrap is controlled only by environment variables; there is no public admin-registration endpoint. Anyone can create a STUDENT account through the public registration endpoint. The request does not accept a role, so public registration can never create an ADMIN account.

Register a student:

```
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "a-strong-password-at-least-10-characters",
  "displayName": "Student One"
}
```

Registration returns `201 Created`. The student can then use the login endpoint below to receive a JWT.

Login:

```
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "email": "the BOOTSTRAP_ADMIN_EMAIL value",
  "password": "the BOOTSTRAP_ADMIN_PASSWORD value"
}
```

The response includes an access token. In Postman, use **Authorization → Bearer Token** and paste `accessToken`.

Create a student (ADMIN token required):

```
POST http://localhost:8080/api/v1/admin/students
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "a-strong-student-password",
  "displayName": "Student One"
}
```

List students (ADMIN token required):

```
GET http://localhost:8080/api/v1/admin/students
```

Access tokens are stateless JWTs and currently expire after 12 hours by default. Passwords are stored as BCrypt hashes. A refresh-token flow is not implemented yet.

## Assessment formats

- **Grand Test:** 200 questions, 180 minutes, 200 marks; not generated or conducted daily.
- **Daily Mock Test:** 50 questions, generated by the admin for a specific date, with all four subjects represented and no time limit. The API records elapsed time for each attempt.
- Grand Test subject distribution: DCME 100 (50%), Mathematics 50 (25%), Physics 25 (12.5%), Chemistry 25 (12.5%).
- Daily 50-question distribution uses the closest whole-question allocation: DCME 25, Mathematics 13, Physics 6, Chemistry 6. Exact percentages cannot all be represented with integer question counts at a total of 50; this uses the largest-remainder rounding method.
- Both formats use four-option, single-correct MCQs. The initial scoring target is +1 for correct and 0 for incorrect or unanswered.

The database stores the per-test subject allocation so a published test retains its exact blueprint.

## Previous-year question bank (PYQ Challenge)

The PYQ feature is separate from the OpenRouter/AI question generator. It uses only admin-imported questions from recorded previous-year sources. Each question keeps its subject, topic, C23 curriculum, source year, paper name, and original question number.

### Examination rules
- A student starts a fresh, randomised C23 paper: DCME 100, Mathematics 50, Physics 25, Chemistry 25.
- 200 questions, 180 minutes, 200 marks; +1 for correct and 0 for incorrect/unanswered.
- Question order and option order are independently randomised and snapshotted for that attempt, so refreshing does not change the paper.
- Only verified and active questions enter the student exam pool.
- A student may have only one in-progress PYQ attempt at a time. Students can access only their own attempt endpoints.
- Admin-only monitoring endpoints show all student attempts and answer reviews. PYQ attempts are not mixed into the AI Grand/Daily test pool.

### Admin API (ADMIN bearer token)

Add one source question:

```
POST /api/v1/admin/pyq/questions
Content-Type: application/json

{
  "subject": "DCME",
  "topic": "Programming",
  "curriculum": "C23",
  "questionText": "Question text from the source paper?",
  "explanation": "Optional explanation.",
  "sourceYear": 2024,
  "sourcePaper": "AP ECET DCME 2024",
  "sourceQuestionNumber": 17,
  "difficulty": "MEDIUM",
  "verified": true,
  "options": [
    {"text":"Option A","correct":false},
    {"text":"Option B","correct":true},
    {"text":"Option C","correct":false},
    {"text":"Option D","correct":false}
  ]
}
```

Bulk import 1–250 questions in one request:

`POST /api/v1/admin/pyq/questions/bulk`

The body is a JSON array of the same question objects shown above. Mark `verified: true` only after checking the question, options, correct answer, and source against the original paper. The exam refuses to start until the bank contains at least 100 verified DCME, 50 Mathematics, 25 Physics, and 25 Chemistry questions.

List and audit imported questions:

`GET /api/v1/admin/pyq/questions?subject=DCME&year=2024&includeUnverified=true`

Register a paper after uploading its PDF to Supabase Storage:

```
POST /api/v1/admin/pyq/papers
Content-Type: application/json

{
  "title": "AP ECET 2024 DCME Question Paper",
  "examYear": 2024,
  "branch": "DCME",
  "curriculum": "C23",
  "paperType": "QUESTION_PAPER",
  "storagePath": "2024/DCME/question-paper.pdf",
  "publicUrl": "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/pyq-papers/2024/DCME/question-paper.pdf",
  "sourceName": "Official source name",
  "attribution": "Source / licence / permission details"
}
```

Use a Supabase Storage bucket named `pyq-papers` (or your chosen bucket name). Keep PDF binaries in Storage, not PostgreSQL; PostgreSQL stores only the paper metadata and URL. The example public URL assumes a public bucket: anyone who obtains the URL can access that PDF. Upload only papers you are permitted to distribute. The app's paper catalogue endpoint itself requires a STUDENT token.

### Student API (STUDENT bearer token)

- `GET /api/v1/pyq/papers` — browse the C23 DCME paper library.
- `POST /api/v1/pyq/attempts` — create a randomised 200-question attempt.
- `GET /api/v1/pyq/attempts/{attemptId}` — retrieve that student's own question set and saved answers (no correct-answer flags).
- `PUT /api/v1/pyq/attempts/{attemptId}/answers/{questionId}` with `{"optionId":"<option-uuid>"}` — save an answer.
- `POST /api/v1/pyq/attempts/{attemptId}/submit` — calculate and store the result.
- `GET /api/v1/pyq/my/results` — view only the authenticated student's PYQ attempt summaries.

### Admin monitoring API (ADMIN bearer token)

- `GET /api/v1/admin/pyq/attempts` — monitor all student PYQ attempts, including in-progress status.
- `GET /api/v1/admin/pyq/attempts/{attemptId}/review` — inspect a student's question-by-question answers and correct answers.

### Database and deployment notes

Migration `V6__add_pyq_question_bank_and_exams.sql` is additive and Flyway-managed. It creates separate PYQ tables and indexes; it does not rewrite or delete existing AI assessment data. It is PostgreSQL-compatible and is applied automatically on the next backend startup/deployment. The question bank and attempt records live in the existing Supabase PostgreSQL database; PDF files live in Supabase Storage. No new paid service or extra database is required for this feature.

Before enabling students, upload and verify enough C23 questions to meet the full 200-question blueprint, upload the permitted PDFs to Storage, register their metadata, and test with a STUDENT account. Run the backend and frontend test/build commands before merging this feature branch.

## Health Check URLs

### Application status:
```
GET http://localhost:8080/
```

Expected response shape:
```json
{
  "status": "UP",
  "message": "ECET Desk API is running",
  "timestamp": "2026-11-08T14:10:00.000Z"
}
```

### Database status:
```
GET http://localhost:8080/db/
```
(also supports `GET http://localhost:8080/db`)

Expected response when connected:
```json
{
  "status": "UP",
  "database": "PostgreSQL",
  "message": "Database connection is healthy",
  "timestamp": "2026-11-08T14:10:00.000Z"
}
```
If the database connection fails, it returns HTTP `503 Service Unavailable` with `"status": "DOWN"` and error details.

Legacy endpoints (`/api/v1/health` and `/actuator/health`) remain available as aliases.

## Exam baseline
The initial exam configuration target is 200 single-answer MCQs over 180 minutes:
- DCME core: 100
- Mathematics: 50
- Physics: 25
- Chemistry: 25

Scoring target: +1 for correct, 0 for incorrect or unanswered. Verify the current official AP ECET DCME pattern before publishing real practice tests.

## Assessment API (ADMIN unless stated otherwise)

Create a Grand Test draft:
```
POST /api/v1/admin/tests
{ "title": "Grand Test 1", "testType": "GRAND" }
```

Create a Daily Mock draft:
```
POST /api/v1/admin/tests
{ "title": "Daily Mock - 2026-11-08", "testType": "DAILY", "scheduledDate": "2026-11-08" }
```
The API fixes the blueprint automatically: Grand = 100/50/25/25 and 180 minutes; Daily = 25/13/6/6 and no time limit (durationMinutes is 0).

Generate missing questions for a draft using OpenRouter:
```
POST /api/v1/admin/tests/{testId}/generate
Content-Type: application/json
{ "instructions": "Focus on core diploma-level topics; avoid repeated concepts." }
```
The request body is optional. Configure `OPENROUTER_API_KEY` in the ignored workspace `.env` file. The default model is configurable through `OPENROUTER_MODEL`. Generated questions remain in DRAFT and must be reviewed before publication.

Create a question manually:
```
POST /api/v1/admin/questions
{
  "subject": "DCME",
  "questionText": "Question text?",
  "explanation": "Why the answer is correct.",
  "difficulty": "MEDIUM",
  "options": [
    {"text":"Option A","correct":false},
    {"text":"Option B","correct":true},
    {"text":"Option C","correct":false},
    {"text":"Option D","correct":false}
  ]
}
```

Review a draft test and its generated answers (ADMIN only):
`GET /api/v1/admin/tests/{testId}`

Attach a question to a draft test:
`POST /api/v1/admin/tests/{testId}/questions/{questionId}`

Publish after the required counts and option validation pass:
`POST /api/v1/admin/tests/{testId}/publish`

Student workflow (STUDENT token):
- `GET /api/v1/tests` — list published tests available today.
- `POST /api/v1/tests/{testId}/attempts` — start once; server records start time.
- `GET /api/v1/attempts/{attemptId}` — retrieve questions and options (correct-answer flags hidden during test).
- `PUT /api/v1/attempts/{attemptId}/answers/{questionId}` with `{"optionId":"<option-uuid>"}` — save/update an answer.
- `POST /api/v1/attempts/{attemptId}/submit` — submit and calculate score/time. Grand tests exceeding duration + grace are marked `TIMED_OUT`.
- `GET /api/v1/my/results` — view only the authenticated student's submitted results summary.
- `GET /api/v1/attempts/{attemptId}/review` — view detailed review of a submitted attempt including questions, selected options, correct options, and the question explanation. Pass `?wrongOnly=true` to view only questions answered incorrectly or missed.

Admin student management & analytics (ADMIN token):
- `GET /api/v1/admin/students` — list registered student accounts.
- `POST /api/v1/admin/students` — provision a new student account.
- `GET /api/v1/admin/tests/{testId}/attempts` — list all student attempts and scores for a specific test.
- `GET /api/v1/admin/students/{studentId}/attempts` — list all attempts by a specific student.
- `GET /api/v1/admin/attempts/{attemptId}/review` — inspect any student's submitted attempt with answers and explanations.
- `GET /api/v1/admin/analytics/leaderboard` — group standings, completion count, total score, and average score across your student group.

Each student gets one attempt per test. Daily mocks do not expire; elapsed seconds are calculated from server-side start and submission timestamps. Grand Tests enforce the 180-minute limit (with network grace margin). Cross-Origin Resource Sharing (CORS) is enabled to support web and mobile app clients.


## Personal progress analytics

- Students can view their own score history, personal best, recent average, and preparation status.
- Score changes are calculated against that student's previous attempt of the same assessment type (AI mock or PYQ); students are never ranked or compared against other students in this view.
- Subject accuracy combines completed AI mock and PYQ attempts. Topic-level recommendations use only topic-tagged PYQ questions and require at least three observed answers.
- Preparation labels use the last three completed attempts where available. They are guidance, not a prediction or guarantee of an ECET result.

## Admin PYQ PDF uploads

The Admin Control Center includes a **PYQ Papers** section. Admins can upload a PDF (maximum 20 MB), enter its title/year/document type, and publish or hide it from the student catalogue. The backend sends the file to Supabase Storage using a server-side service-role key; that key must never be exposed to the frontend.

Configure these backend environment variables in the local root `.env` and the deployment platform:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (secret; never commit it or add it to a `VITE_*` variable)
- `SUPABASE_STORAGE_BUCKET` (defaults to `pyq-papers`)

Create the configured Supabase Storage bucket before uploading. The current student catalogue uses public PDF URLs, so the `pyq-papers` bucket must be public for direct student viewing. Anyone who obtains a public file URL can access that file; use a private bucket and signed-URL flow instead if authenticated-only file access is required. Upload only papers you are permitted to distribute.
