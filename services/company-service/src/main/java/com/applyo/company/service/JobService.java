package com.applyo.company.service;

import com.applyo.company.dto.CreateJobRequest;
import com.applyo.company.dto.JobResponse;
import com.applyo.company.exception.JobNotFoundException;
import com.applyo.company.model.CustomQuestion;
import com.applyo.company.model.Job;
import com.applyo.company.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public JobResponse createJob(String companyId, CreateJobRequest request) {
        // Add IDs to custom questions
        if (request.getCustomQuestions() != null) {
            request.getCustomQuestions().forEach(q -> {
                if (q.getId() == null) {
                    q.setId(UUID.randomUUID().toString());
                }
            });
        }

        Job job = Job.builder()
                .companyId(companyId)
                .title(request.getTitle())
                .description(request.getDescription())
                .department(request.getDepartment())
                .location(request.getLocation())
                .workType(request.getWorkType())
                .employmentType(request.getEmploymentType())
                .salary(request.getSalary())
                .requirements(request.getRequirements())
                .responsibilities(request.getResponsibilities())
                .benefits(request.getBenefits())
                .requiredFields(request.getRequiredFields())
                .customQuestions(request.getCustomQuestions())
                .closingDate(request.getClosingDate())
                .status("draft")
                .build();

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    public JobResponse getJob(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));
        return mapToResponse(job);
    }

    public Page<JobResponse> getCompanyJobs(String companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return jobRepository.findByCompanyId(companyId, pageable)
                .map(this::mapToResponse);
    }

    public Page<JobResponse> getActiveJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return jobRepository.findByStatus("active", pageable)
                .map(this::mapToResponse);
    }

    public JobResponse updateJob(String jobId, CreateJobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getDepartment() != null) job.setDepartment(request.getDepartment());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getWorkType() != null) job.setWorkType(request.getWorkType());
        if (request.getEmploymentType() != null) job.setEmploymentType(request.getEmploymentType());
        if (request.getSalary() != null) job.setSalary(request.getSalary());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getResponsibilities() != null) job.setResponsibilities(request.getResponsibilities());
        if (request.getBenefits() != null) job.setBenefits(request.getBenefits());
        if (request.getRequiredFields() != null) job.setRequiredFields(request.getRequiredFields());
        if (request.getCustomQuestions() != null) {
            request.getCustomQuestions().forEach(q -> {
                if (q.getId() == null) {
                    q.setId(UUID.randomUUID().toString());
                }
            });
            job.setCustomQuestions(request.getCustomQuestions());
        }
        if (request.getClosingDate() != null) job.setClosingDate(request.getClosingDate());

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    public JobResponse publishJob(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));

        job.setStatus("active");
        job.setPublishedAt(Instant.now());
        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    public JobResponse pauseJob(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));

        job.setStatus("paused");
        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    public JobResponse closeJob(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));

        job.setStatus("closed");
        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    public void deleteJob(String jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new JobNotFoundException("Job not found");
        }
        jobRepository.deleteById(jobId);
    }

    public void incrementApplicationCount(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));
        job.setApplicationsCount(job.getApplicationsCount() + 1);
        jobRepository.save(job);
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompanyId())
                .title(job.getTitle())
                .description(job.getDescription())
                .department(job.getDepartment())
                .location(job.getLocation())
                .workType(job.getWorkType())
                .employmentType(job.getEmploymentType())
                .salary(job.getSalary())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .benefits(job.getBenefits())
                .requiredFields(job.getRequiredFields())
                .customQuestions(job.getCustomQuestions())
                .status(job.getStatus())
                .publishedAt(job.getPublishedAt())
                .closingDate(job.getClosingDate())
                .applicationsCount(job.getApplicationsCount())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
