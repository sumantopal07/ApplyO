package com.applyo.application.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateSnapshot {

    private String fullName;
    private String email;
    private String phone;
    private String headline;
    private String location;
    private String about;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private List<Map<String, Object>> education;
    private List<Map<String, Object>> experience;
    private List<String> skills;
}
