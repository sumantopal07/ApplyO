package com.applyo.application.dto;

import com.applyo.application.model.ConsentTokenStatus;
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
public class ConsentTokenResponse {

    private String id;
    private String token;
    private String candidateId;
    private String companyId;
    private String jobId;
    private List<String> requestedFields;
    private String purposeOfUse;
    private Integer retentionDays;
    private ConsentTokenStatus status;
    private Instant expiresAt;
    private Instant createdAt;
    private Instant respondedAt;
}
