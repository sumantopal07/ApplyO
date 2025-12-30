package com.applyo.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConsentTokenRequest {

    @NotBlank(message = "Candidate email is required")
    private String candidateEmail;

    private String jobId;

    @NotEmpty(message = "Requested fields are required")
    private List<String> requestedFields;

    private String purposeOfUse;
    private Integer retentionDays;
    private Integer expirationHours;
}
