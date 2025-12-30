package com.applyo.company.controller;

import com.applyo.company.dto.*;
import com.applyo.company.service.CompanyService;
import com.applyo.company.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/company/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateJobRequest request) {
        CompanyResponse company = companyService.getCompany(userId);
        JobResponse response = jobService.createJob(company.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getCompanyJobs(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        CompanyResponse company = companyService.getCompany(userId);
        Page<JobResponse> jobs = jobService.getCompanyJobs(company.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> getJob(
            @PathVariable String jobId) {
        JobResponse response = jobService.getJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable String jobId,
            @Valid @RequestBody CreateJobRequest request) {
        JobResponse response = jobService.updateJob(jobId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{jobId}/publish")
    public ResponseEntity<ApiResponse<JobResponse>> publishJob(
            @PathVariable String jobId) {
        JobResponse response = jobService.publishJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{jobId}/pause")
    public ResponseEntity<ApiResponse<JobResponse>> pauseJob(
            @PathVariable String jobId) {
        JobResponse response = jobService.pauseJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{jobId}/close")
    public ResponseEntity<ApiResponse<JobResponse>> closeJob(
            @PathVariable String jobId) {
        JobResponse response = jobService.closeJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable String jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
