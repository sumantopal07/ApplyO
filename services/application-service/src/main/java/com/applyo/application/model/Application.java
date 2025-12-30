package com.applyo.application.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
@CompoundIndex(name = "candidate_job_idx", def = "{'candidateId': 1, 'jobId': 1}", unique = true)
public class Application {

    @Id
    private String id;

    @Indexed
    private String candidateId;

    @Indexed
    private String jobId;

    @Indexed
    private String companyId;

    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // Candidate data snapshot at time of application
    private CandidateSnapshot candidateSnapshot;

    // Answers to custom questions
    @Builder.Default
    private List<QuestionAnswer> questionAnswers = new ArrayList<>();

    // Resume/documents attached
    @Builder.Default
    private List<String> documentIds = new ArrayList<>();

    // Consent information
    private ConsentInfo consent;

    // Tracking
    private String source; // direct, api, linkedin, etc.
    private String referrer;

    @CreatedDate
    private Instant appliedAt;

    @LastModifiedDate
    private Instant updatedAt;

    private Instant reviewedAt;
    private String reviewedBy;
    private String rejectionReason;
}
