package com.applyo.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCompanyRequest {

    private String name;
    private String website;
    private String industry;
    private String size;
    private String description;
    private String logoUrl;
    private String location;
    private String dataRetentionPolicy;
    private String privacyPolicyUrl;
}
