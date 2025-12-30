package com.applyo.company.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
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
@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    @Indexed
    private String companyId;

    private String title;
    private String description;
    private String department;
    private String location;
    private String workType; // remote, onsite, hybrid
    private String employmentType; // full-time, part-time, contract
    private SalaryRange salary;

    @Builder.Default
    private List<String> requirements = new ArrayList<>();

    @Builder.Default
    private List<String> responsibilities = new ArrayList<>();

    @Builder.Default
    private List<String> benefits = new ArrayList<>();

    // Fields required from candidate for this job
    @Builder.Default
    private List<RequiredField> requiredFields = new ArrayList<>();

    // Custom questions for this job
    @Builder.Default
    private List<CustomQuestion> customQuestions = new ArrayList<>();

    @Builder.Default
    private String status = "draft"; // draft, active, paused, closed

    private Instant publishedAt;
    private Instant closingDate;

    @Builder.Default
    private Integer applicationsCount = 0;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
