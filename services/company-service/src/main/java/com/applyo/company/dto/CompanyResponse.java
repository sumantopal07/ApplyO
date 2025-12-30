package com.applyo.company.dto;

import com.applyo.company.model.ApiKey;
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
public class CompanyResponse {

    private String id;
    private String userId;
    private String name;
    private String email;
    private String website;
    private String industry;
    private String size;
    private String description;
    private String logoUrl;
    private String location;
    private Boolean verified;
    private String subscriptionTier;
    private List<ApiKeyResponse> apiKeys;
    private List<String> webhookUrls;
    private String dataRetentionPolicy;
    private String privacyPolicyUrl;
    private Instant createdAt;
    private Instant updatedAt;
}
