package com.applyo.application.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "consent_tokens")
public class ConsentToken {

    @Id
    private String id;

    @Indexed(unique = true)
    private String token;

    @Indexed
    private String candidateId;

    @Indexed
    private String companyId;

    private String jobId;

    // What data fields are being requested
    private List<String> requestedFields;

    // What the company says they'll use the data for
    private String purposeOfUse;

    // How long company will retain the data
    private Integer retentionDays;

    @Builder.Default
    private ConsentTokenStatus status = ConsentTokenStatus.PENDING;

    private Instant expiresAt;

    @CreatedDate
    private Instant createdAt;

    private Instant respondedAt;
}
