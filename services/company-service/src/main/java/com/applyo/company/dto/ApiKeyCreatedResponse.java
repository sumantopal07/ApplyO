package com.applyo.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyCreatedResponse {

    private String id;
    private String name;
    private String apiKey; // Only returned on creation
    private String prefix;
    private List<String> scopes;
    private Integer rateLimit;
}
