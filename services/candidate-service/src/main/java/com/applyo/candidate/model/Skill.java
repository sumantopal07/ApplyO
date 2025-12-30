package com.applyo.candidate.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    private String id;
    private String name;
    private String category; // technical, soft, language, etc.
    private String proficiency; // beginner, intermediate, advanced, expert
}
