package com.applyo.candidate.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Experience {

    private String id;
    private String companyName;
    private String role;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean current;
    private String description;
    private String employmentType; // full-time, part-time, contract, internship
}
