package com.applyo.candidate.dto;

import com.applyo.candidate.model.Education;
import com.applyo.candidate.model.Experience;
import com.applyo.candidate.model.Skill;
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
public class CandidateResponse {

    private String id;
    private String userId;
    private String email;
    private String fullName;
    private String phone;
    private String headline;
    private String location;
    private String about;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private List<Education> education;
    private List<Experience> experience;
    private List<Skill> skills;
    private List<String> documentIds;
    private Boolean profileComplete;
    private Integer profileCompletionPercentage;
    private Instant createdAt;
    private Instant updatedAt;
}
