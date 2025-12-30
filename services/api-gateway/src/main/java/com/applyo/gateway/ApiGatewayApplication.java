package com.applyo.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    @Value("${services.auth-service.url:http://localhost:8083}")
    private String authServiceUrl;
    
    @Value("${services.candidate-service.url:http://localhost:8081}")
    private String candidateServiceUrl;
    
    @Value("${services.company-service.url:http://localhost:8082}")
    private String companyServiceUrl;
    
    @Value("${services.application-service.url:http://localhost:8084}")
    private String applicationServiceUrl;
    
    @Value("${services.document-service.url:http://localhost:8085}")
    private String documentServiceUrl;

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes
                .route("auth-service", r -> r
                        .path("/api/v1/auth/**")
                        .uri(authServiceUrl))
                
                // Candidate Service Routes
                .route("candidate-service", r -> r
                        .path("/api/v1/candidates/**", "/api/v1/candidate/**")
                        .uri(candidateServiceUrl))
                
                // Company Service Routes
                .route("company-service", r -> r
                        .path("/api/v1/companies/**", "/api/v1/company/**")
                        .uri(companyServiceUrl))
                
                // Application Service Routes
                .route("application-service", r -> r
                        .path("/api/v1/applications/**", "/api/v1/consent/**")
                        .uri(applicationServiceUrl))
                
                // Document Service Routes
                .route("document-service", r -> r
                        .path("/api/v1/documents/**")
                        .uri(documentServiceUrl))
                
                .build();
    }
}
