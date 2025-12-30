package com.applyo.application.dto;

import com.applyo.application.model.*;
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
public class ApplicationResponse {

    private String id;
    private String candidateId;
    private String jobId;
    private String companyId;
    private ApplicationStatus status;
    private CandidateSnapshot candidateSnapshot;
    private List<QuestionAnswer> questionAnswers;
    private List<String> documentIds;
    private ConsentInfo consent;
    private String source;
    private Instant appliedAt;
    private Instant updatedAt;
    private Instant reviewedAt;
    private String reviewedBy;
    private String rejectionReason;
}
