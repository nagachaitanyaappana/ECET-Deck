# Paradox ECET Deck

**Prepare. Practice. Progress.**

A focused ECET preparation platform for DCME students, bringing practice tests, previous-year questions, and personal progress tracking together in one place.

> **Paradox** is the product identity. The platform is being built for a small private study group, with a clean experience across web and future mobile/desktop apps.

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
