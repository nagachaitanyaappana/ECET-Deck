# Stage 1: Build the application using JDK 21 and Maven
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom and source code
COPY pom.xml .
COPY src ./src

# Build production jar
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime using Temurin JRE 21 on Ubuntu Jammy (glibc with full root CA certs)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy built application jar
COPY --from=build /app/target/app.jar app.jar

# Render injects PORT automatically (e.g. 10000)
# Spring Boot reads server.port=${PORT:8080}
EXPOSE 8080

# Keep memory within Render's 512 MB ceiling and force IPv4 stack to prevent Supabase SSL handshake drops
ENV JAVA_TOOL_OPTIONS="-Xmx350m -Xms200m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError -Djava.net.preferIPv4Stack=true -Djdk.tls.client.protocols=TLSv1.2,TLSv1.3 -Dhttps.protocols=TLSv1.2,TLSv1.3"

ENTRYPOINT ["java", "-jar", "app.jar"]
