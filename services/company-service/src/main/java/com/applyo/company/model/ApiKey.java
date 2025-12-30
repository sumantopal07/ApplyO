package com.applyo.company.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKey {

    private String id;
    private String keyHash;
    private String name;
    private String prefix; // First 8 chars for display

    @Builder.Default
    private List<String> scopes = new ArrayList<>(); // read:candidates, write:applications, etc.

    @Builder.Default
    private Integer rateLimit = 60; // requests per minute

    @Builder.Default
    private Boolean active = true;

    private Instant expiresAt;
    private Instant lastUsedAt;
    private Instant createdAt;
}
