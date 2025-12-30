package com.applyo.application.service;

import com.applyo.application.dto.*;
import com.applyo.application.exception.ConsentTokenExpiredException;
import com.applyo.application.exception.ConsentTokenNotFoundException;
import com.applyo.application.model.ConsentToken;
import com.applyo.application.model.ConsentTokenStatus;
import com.applyo.application.repository.ConsentTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConsentService {

    private final ConsentTokenRepository consentTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public ConsentTokenResponse createConsentToken(String companyId, CreateConsentTokenRequest request) {
        // Generate secure token
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        int expirationHours = request.getExpirationHours() != null ? request.getExpirationHours() : 72;

        ConsentToken consentToken = ConsentToken.builder()
                .token(token)
                .companyId(companyId)
                .jobId(request.getJobId())
                .requestedFields(request.getRequestedFields())
                .purposeOfUse(request.getPurposeOfUse())
                .retentionDays(request.getRetentionDays())
                .expiresAt(Instant.now().plus(expirationHours, ChronoUnit.HOURS))
                .build();

        consentToken = consentTokenRepository.save(consentToken);
        return mapToResponse(consentToken);
    }

    public ConsentTokenResponse getConsentToken(String token) {
        ConsentToken consentToken = consentTokenRepository.findByToken(token)
                .orElseThrow(() -> new ConsentTokenNotFoundException("Consent token not found"));
        return mapToResponse(consentToken);
    }

    public ConsentTokenResponse respondToConsent(String candidateId, String token, ConsentDecisionRequest request) {
        ConsentToken consentToken = consentTokenRepository.findByToken(token)
                .orElseThrow(() -> new ConsentTokenNotFoundException("Consent token not found"));

        // Check if expired
        if (consentToken.getExpiresAt().isBefore(Instant.now())) {
            consentToken.setStatus(ConsentTokenStatus.EXPIRED);
            consentTokenRepository.save(consentToken);
            throw new ConsentTokenExpiredException("Consent token has expired");
        }

        // Check if already responded
        if (consentToken.getStatus() != ConsentTokenStatus.PENDING) {
            throw new ConsentTokenExpiredException("Consent token has already been used");
        }

        consentToken.setCandidateId(candidateId);
        consentToken.setStatus(request.getApproved() ? ConsentTokenStatus.APPROVED : ConsentTokenStatus.DENIED);
        consentToken.setRespondedAt(Instant.now());

        consentToken = consentTokenRepository.save(consentToken);
        return mapToResponse(consentToken);
    }

    public ConsentTokenResponse revokeConsent(String candidateId, String tokenId) {
        ConsentToken consentToken = consentTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ConsentTokenNotFoundException("Consent token not found"));

        if (!candidateId.equals(consentToken.getCandidateId())) {
            throw new ConsentTokenNotFoundException("Consent token not found");
        }

        consentToken.setStatus(ConsentTokenStatus.REVOKED);
        consentToken = consentTokenRepository.save(consentToken);
        return mapToResponse(consentToken);
    }

    public Page<ConsentTokenResponse> getCandidateConsents(String candidateId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return consentTokenRepository.findByCandidateId(candidateId, pageable)
                .map(this::mapToResponse);
    }

    public Page<ConsentTokenResponse> getCompanyConsents(String companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return consentTokenRepository.findByCompanyId(companyId, pageable)
                .map(this::mapToResponse);
    }

    private ConsentTokenResponse mapToResponse(ConsentToken consentToken) {
        return ConsentTokenResponse.builder()
                .id(consentToken.getId())
                .token(consentToken.getToken())
                .candidateId(consentToken.getCandidateId())
                .companyId(consentToken.getCompanyId())
                .jobId(consentToken.getJobId())
                .requestedFields(consentToken.getRequestedFields())
                .purposeOfUse(consentToken.getPurposeOfUse())
                .retentionDays(consentToken.getRetentionDays())
                .status(consentToken.getStatus())
                .expiresAt(consentToken.getExpiresAt())
                .createdAt(consentToken.getCreatedAt())
                .respondedAt(consentToken.getRespondedAt())
                .build();
    }
}
