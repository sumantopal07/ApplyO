package com.applyo.company.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomQuestion {

    private String id;
    private String question;
    private String type; // text, textarea, select, multiselect, radio, checkbox
    private Boolean required;
    private List<String> options; // For select, multiselect, radio
}
