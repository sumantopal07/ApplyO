package com.applyo.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyResponse {

    private String id;
    private String name;
    private String prefix;
    private List<String> scopes;
    private Integer rateLimit;
    private Boolean active;
    private Instant expiresAt;
    private Instant lastUsedAt;
    private Instant createdAt;
}
