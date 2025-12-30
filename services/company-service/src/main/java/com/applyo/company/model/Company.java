package com.applyo.company.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "companies")
public class Company {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String website;
    private String industry;
    private String size; // 1-10, 11-50, 51-200, 201-500, 500+
    private String description;
    private String logoUrl;
    private String location;

    @Builder.Default
    private Boolean verified = false;

    @Builder.Default
    private String subscriptionTier = "free"; // free, starter, professional, enterprise

    @Builder.Default
    private List<ApiKey> apiKeys = new ArrayList<>();

    @Builder.Default
    private List<String> webhookUrls = new ArrayList<>();

    private String dataRetentionPolicy;
    private String privacyPolicyUrl;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
