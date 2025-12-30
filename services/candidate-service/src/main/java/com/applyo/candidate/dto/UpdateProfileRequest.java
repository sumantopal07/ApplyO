package com.applyo.candidate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String fullName;
    private String phone;
    private String headline;
    private String location;
    private String about;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
}
