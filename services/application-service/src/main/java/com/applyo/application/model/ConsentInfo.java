package com.applyo.application.model;

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
public class ConsentInfo {

    private String consentTokenId;
    private Instant consentGivenAt;
    private List<String> dataFieldsConsented; // Which fields the candidate allowed
    private String purposeOfUse;
    private Instant dataRetentionUntil;
    private Boolean canShare; // Whether company can share data
}
