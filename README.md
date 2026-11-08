# ECET Desk API

Spring Boot backend for ECET Desk, a private daily ECET practice platform for a small group of DCME students.

## Current status
- Spring Boot 3.5 / Java 21
- Maven Wrapper (Maven 3.9.11; no global Maven installation required)
- PostgreSQL connectivity from a workspace-root `.env` file
- Flyway-managed `app` schema and initial `app.users` table
- Health endpoint: `GET /api/v1/health`

Authentication, test management, AI question generation, examination attempts and results are planned next. They are not implemented yet.

## Requirements
- JDK 21 (a newer compatible JDK can also work)
- PostgreSQL database

## Configure the workspace .env file
1. In the repository root (the same folder as `pom.xml`), copy `.env.example` to a new file named `.env`.
2. Open `.env` and fill in your Supabase Session Pooler details.

Example:

```properties
DB_URL=jdbc:postgresql://YOUR_SESSION_POOLER_HOST:5432/postgres?sslmode=require
DB_USERNAME=YOUR_SUPABASE_POOLER_USERNAME
DB_PASSWORD=YOUR_SUPABASE_DATABASE_PASSWORD
```

Use the exact host and username shown by Supabase under **Connect → Session pooler**. Do not add quotes around the values. Keep the password private.

Spring Boot loads this file from the process working directory using its config import support. Start Maven from the repository root so it finds the workspace `.env` file.

### Git safety
The root `.gitignore` ignores `.env` and other `.env.*` files, while allowing the placeholder-only `.env.example`.

Verify that your real file is ignored:

```powershell
git check-ignore .env
```

The command should print `.env`. Never force-add the real `.env` file.

## Run on Windows (PowerShell)

No separate Maven installation is needed. From the repository root:

```powershell
.\\mvnw.cmd -version
.\\mvnw.cmd spring-boot:run
```

The first run downloads Apache Maven 3.9.11 into your user-level `.m2\wrapper\dists` folder. Later runs reuse that download.

To run tests:

```powershell
.\\mvnw.cmd test
```

On Linux/macOS, use `./mvnw` (or `sh mvnw` if the executable bit is not set).

The first successful application startup runs Flyway migrations and creates the `app` schema and initial users table.

## Test with Postman

```
GET http://localhost:8080/api/v1/health
```

Expected response shape:

```json
{
  "status": "UP",
  "message": "ECET Desk API is running",
  "timestamp": "..."
}
```

Database health:

```
GET http://localhost:8080/actuator/health
```

## Exam baseline
The initial exam configuration target is 200 single-answer MCQs over 180 minutes:
- DCME core: 100
- Mathematics: 50
- Physics: 25
- Chemistry: 25

Scoring target: +1 for correct, 0 for incorrect or unanswered. Verify the current official AP ECET DCME pattern before publishing real practice tests.
