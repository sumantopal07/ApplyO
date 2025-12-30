package com.applyo.company.dto;

import com.applyo.company.model.CustomQuestion;
import com.applyo.company.model.RequiredField;
import com.applyo.company.model.SalaryRange;
import jakarta.validation.constraints.NotBlank;
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
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String department;
    private String location;
    private String workType;
    private String employmentType;
    private SalaryRange salary;
    private List<String> requirements;
    private List<String> responsibilities;
    private List<String> benefits;
    private List<RequiredField> requiredFields;
    private List<CustomQuestion> customQuestions;
    private Instant closingDate;
}
