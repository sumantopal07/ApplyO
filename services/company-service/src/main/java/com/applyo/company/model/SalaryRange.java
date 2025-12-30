package com.applyo.company.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryRange {

    private Integer min;
    private Integer max;
    private String currency;
    private String period; // hourly, monthly, yearly
}
