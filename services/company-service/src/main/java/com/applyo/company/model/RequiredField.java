package com.applyo.company.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequiredField {

    private String fieldName; // fullName, email, phone, resume, education, experience, skills
    private Boolean required;
    private String label;
}
