package com.applyo.application.service;

import com.applyo.application.dto.*;
import com.applyo.application.exception.ApplicationAlreadyExistsException;
import com.applyo.application.exception.ApplicationNotFoundException;
import com.applyo.application.model.*;
import com.applyo.application.repository.ApplicationRepository;
import com.applyo.application.repository.ConsentTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ConsentTokenRepository consentTokenRepository;

    public ApplicationResponse createApplication(String candidateId, CreateApplicationRequest request) {
        // Check if already applied
        if (applicationRepository.existsByCandidateIdAndJobId(candidateId, request.getJobId())) {
            throw new ApplicationAlreadyExistsException("Already applied to this job");
        }

        // Get consent info if token provided
        ConsentInfo consentInfo = null;
        if (request.getConsentTokenId() != null) {
            consentTokenRepository.findById(request.getConsentTokenId())
                    .filter(t -> t.getStatus() == ConsentTokenStatus.APPROVED)
                    .ifPresent(token -> {
                        // Consent was pre-approved
                    });
        }

        Application application = Application.builder()
                .candidateId(candidateId)
                .jobId(request.getJobId())
                .candidateSnapshot(request.getCandidateSnapshot())
                .questionAnswers(request.getQuestionAnswers())
                .documentIds(request.getDocumentIds())
                .source(request.getSource() != null ? request.getSource() : "direct")
                .consent(consentInfo)
                .build();

        application = applicationRepository.save(application);
        return mapToResponse(application);
    }

    public ApplicationResponse getApplication(String applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));
        return mapToResponse(application);
    }

    public Page<ApplicationResponse> getCandidateApplications(String candidateId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return applicationRepository.findByCandidateId(candidateId, pageable)
                .map(this::mapToResponse);
    }

    public Page<ApplicationResponse> getJobApplications(String jobId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return applicationRepository.findByJobId(jobId, pageable)
                .map(this::mapToResponse);
    }

    public Page<ApplicationResponse> getCompanyApplications(String companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return applicationRepository.findByCompanyId(companyId, pageable)
                .map(this::mapToResponse);
    }

    public ApplicationResponse updateApplicationStatus(
            String applicationId,
            String reviewerId,
            UpdateApplicationStatusRequest request) {
        
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        application.setStatus(request.getStatus());
        application.setReviewedAt(Instant.now());
        application.setReviewedBy(reviewerId);

        if (request.getStatus() == ApplicationStatus.REJECTED) {
            application.setRejectionReason(request.getRejectionReason());
        }

        application = applicationRepository.save(application);
        return mapToResponse(application);
    }

    public ApplicationResponse withdrawApplication(String candidateId, String applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        if (!application.getCandidateId().equals(candidateId)) {
            throw new ApplicationNotFoundException("Application not found");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        application = applicationRepository.save(application);
        return mapToResponse(application);
    }

    private ApplicationResponse mapToResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .candidateId(application.getCandidateId())
                .jobId(application.getJobId())
                .companyId(application.getCompanyId())
                .status(application.getStatus())
                .candidateSnapshot(application.getCandidateSnapshot())
                .questionAnswers(application.getQuestionAnswers())
                .documentIds(application.getDocumentIds())
                .consent(application.getConsent())
                .source(application.getSource())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .reviewedAt(application.getReviewedAt())
                .reviewedBy(application.getReviewedBy())
                .rejectionReason(application.getRejectionReason())
                .build();
    }
}
