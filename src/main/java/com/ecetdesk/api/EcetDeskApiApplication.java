package com.ecetdesk.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EcetDeskApiApplication {

    public static void main(String[] args) {
        String dbUrl = System.getenv("DB_URL");
        if (dbUrl == null) dbUrl = System.getenv("DATABASE_URL");
        String dbUser = System.getenv("DB_USERNAME");
        if (dbUser == null) dbUser = System.getenv("DATABASE_USERNAME");

        System.out.println("=== RENDER DATABASE ENVIRONMENT CHECK ===");
        System.out.println("Configured DB_URL: " + (dbUrl != null ? dbUrl.replaceAll(":[^:@/]+@", ":***@") : "[NOT SET - using localhost]"));
        System.out.println("Configured DB_USERNAME: " + (dbUser != null ? dbUser : "[NOT SET - using default postgres]"));
        System.out.println("==========================================");

        SpringApplication.run(EcetDeskApiApplication.class, args);
    }
}
