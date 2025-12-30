package com.applyo.company.dto;

import com.applyo.company.model.CustomQuestion;
import com.applyo.company.model.RequiredField;
import com.applyo.company.model.SalaryRange;
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
public class JobResponse {

    private String id;
    private String companyId;
    private String title;
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
    private String status;
    private Instant publishedAt;
    private Instant closingDate;
    private Integer applicationsCount;
    private Instant createdAt;
    private Instant updatedAt;
}
