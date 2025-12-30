package com.applyo.candidate.controller;

import com.applyo.candidate.dto.*;
import com.applyo.candidate.service.CandidateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping
    public ResponseEntity<ApiResponse<CandidateResponse>> createCandidate(
            @Valid @RequestBody CreateCandidateRequest request) {
        CandidateResponse response = candidateService.createCandidate(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateResponse>> getProfile(
            @RequestHeader("X-User-Id") String userId) {
        CandidateResponse response = candidateService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<CandidateResponse>> getProfileById(
            @PathVariable String id) {
        CandidateResponse response = candidateService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<CandidateResponse>> lookupByEmail(
            @RequestParam String email) {
        CandidateResponse response = candidateService.getProfileByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateResponse>> updateProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        CandidateResponse response = candidateService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Education endpoints
    @PostMapping("/education")
    public ResponseEntity<ApiResponse<CandidateResponse>> addEducation(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody EducationRequest request) {
        CandidateResponse response = candidateService.addEducation(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @DeleteMapping("/education/{educationId}")
    public ResponseEntity<ApiResponse<CandidateResponse>> deleteEducation(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String educationId) {
        CandidateResponse response = candidateService.deleteEducation(userId, educationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Experience endpoints
    @PostMapping("/experience")
    public ResponseEntity<ApiResponse<CandidateResponse>> addExperience(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody ExperienceRequest request) {
        CandidateResponse response = candidateService.addExperience(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @DeleteMapping("/experience/{experienceId}")
    public ResponseEntity<ApiResponse<CandidateResponse>> deleteExperience(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String experienceId) {
        CandidateResponse response = candidateService.deleteExperience(userId, experienceId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Skills endpoints
    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<CandidateResponse>> addSkills(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody SkillsRequest request) {
        CandidateResponse response = candidateService.addSkills(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<ApiResponse<CandidateResponse>> deleteSkill(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String skillId) {
        CandidateResponse response = candidateService.deleteSkill(userId, skillId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
