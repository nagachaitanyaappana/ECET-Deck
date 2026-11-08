# ECET Desk API

Spring Boot backend for ECET Desk, a private daily ECET practice platform for a small group of DCME students.

## Current status

Initial backend foundation:
- Spring Boot 3.5 / Java 21 / Maven
- PostgreSQL connectivity through environment variables
- Flyway-managed `app` schema
- Initial `app.users` table
- Health endpoint: `GET /api/v1/health`
- Actuator health endpoint: `GET /actuator/health`

Authentication, test management, AI question generation, examination attempts and results are planned next. They are not implemented yet.

## Requirements

- JDK 21
- Maven 3.9+ (or use the Maven wrapper once generated locally)
- PostgreSQL database

## Configure database

Set these environment variables before starting the application:

| Variable | Example |
|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/ecet_desk` |
| `DB_USERNAME` | Your PostgreSQL username |
| `DB_PASSWORD` | Your PostgreSQL password |

For Supabase Session Pooler, use the host, port, database and username from the Supabase **Connect** panel. The JDBC URL should follow this format:

```
jdbc:postgresql://YOUR_SESSION_POOLER_HOST:5432/postgres?sslmode=require
```

Use the exact pooler username Supabase provides. Never commit credentials or paste them into source files.

## Run

Windows PowerShell:

```powershell
$env:DB_URL = "jdbc:postgresql://YOUR_HOST:5432/postgres?sslmode=require"
$env:DB_USERNAME = "YOUR_POOLER_USERNAME"
$env:DB_PASSWORD = "YOUR_DATABASE_PASSWORD"
mvn spring-boot:run
```

The first successful startup runs Flyway migrations and creates the `app` schema and initial users table.

## Test with Postman

**Request**

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
