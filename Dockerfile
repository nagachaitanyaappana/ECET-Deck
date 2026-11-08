# Stage 1: Build the application using JDK 21 and Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and compile application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Lightweight JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy executable jar from build stage
COPY --from=build /app/target/ecet-desk-api-*.jar app.jar

# Render injects PORT automatically (e.g. 10000)
# Spring Boot reads server.port=${PORT:8080}
EXPOSE 8080

# Keep memory within Render's 512 MB free tier ceiling
ENV JAVA_TOOL_OPTIONS="-Xmx350m -Xms200m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["java", "-jar", "app.jar"]
