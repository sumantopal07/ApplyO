package com.applyo.application.dto;

import com.applyo.application.model.CandidateSnapshot;
import com.applyo.application.model.QuestionAnswer;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateApplicationRequest {

    @NotBlank(message = "Job ID is required")
    private String jobId;

    private CandidateSnapshot candidateSnapshot;
    private List<QuestionAnswer> questionAnswers;
    private List<String> documentIds;
    private String consentTokenId;
    private String source;
}
