package com.applyo.application.controller;

import com.applyo.application.dto.*;
import com.applyo.application.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping("/stats/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApplicationStats(
            @RequestHeader("X-User-Id") String userId) {
        Map<String, Object> stats = applicationService.getApplicationStats(userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplications(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) Integer limit) {
        List<ApplicationResponse> applications = applicationService.getRecentApplications(userId, limit != null ? limit : 10);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(
            @RequestHeader("X-User-Id") String candidateId,
            @Valid @RequestBody CreateApplicationRequest request) {
        ApplicationResponse response = applicationService.createApplication(candidateId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplication(
            @PathVariable String applicationId) {
        ApplicationResponse response = applicationService.getApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/candidate")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getCandidateApplications(
            @RequestHeader("X-User-Id") String candidateId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationResponse> applications = applicationService.getCandidateApplications(candidateId, page, size);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getJobApplications(
            @PathVariable String jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationResponse> applications = applicationService.getJobApplications(jobId, page, size);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @GetMapping("/company")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getCompanyApplications(
            @RequestHeader("X-User-Id") String companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ApplicationResponse> applications = applicationService.getCompanyApplications(companyId, page, size);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @PathVariable String applicationId,
            @RequestHeader("X-User-Id") String reviewerId,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        ApplicationResponse response = applicationService.updateApplicationStatus(applicationId, reviewerId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{applicationId}/withdraw")
    public ResponseEntity<ApiResponse<ApplicationResponse>> withdrawApplication(
            @RequestHeader("X-User-Id") String candidateId,
            @PathVariable String applicationId) {
        ApplicationResponse response = applicationService.withdrawApplication(candidateId, applicationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
