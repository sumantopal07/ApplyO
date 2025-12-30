package com.applyo.application.controller;

import com.applyo.application.dto.*;
import com.applyo.application.service.ConsentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/consent")
@RequiredArgsConstructor
public class ConsentController {

    private final ConsentService consentService;

    // Company creates a consent request
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<ConsentTokenResponse>> createConsentToken(
            @RequestHeader("X-User-Id") String companyId,
            @Valid @RequestBody CreateConsentTokenRequest request) {
        ConsentTokenResponse response = consentService.createConsentToken(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    // Get consent token details (for consent page)
    @GetMapping("/token/{token}")
    public ResponseEntity<ApiResponse<ConsentTokenResponse>> getConsentToken(
            @PathVariable String token) {
        ConsentTokenResponse response = consentService.getConsentToken(token);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Candidate responds to consent request
    @PostMapping("/token/{token}/respond")
    public ResponseEntity<ApiResponse<ConsentTokenResponse>> respondToConsent(
            @RequestHeader("X-User-Id") String candidateId,
            @PathVariable String token,
            @Valid @RequestBody ConsentDecisionRequest request) {
        ConsentTokenResponse response = consentService.respondToConsent(candidateId, token, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Candidate revokes previously given consent
    @PostMapping("/{consentId}/revoke")
    public ResponseEntity<ApiResponse<ConsentTokenResponse>> revokeConsent(
            @RequestHeader("X-User-Id") String candidateId,
            @PathVariable String consentId) {
        ConsentTokenResponse response = consentService.revokeConsent(candidateId, consentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Get candidate's consent history
    @GetMapping("/candidate")
    public ResponseEntity<ApiResponse<Page<ConsentTokenResponse>>> getCandidateConsents(
            @RequestHeader("X-User-Id") String candidateId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ConsentTokenResponse> consents = consentService.getCandidateConsents(candidateId, page, size);
        return ResponseEntity.ok(ApiResponse.success(consents));
    }

    // Get company's consent requests
    @GetMapping("/company")
    public ResponseEntity<ApiResponse<Page<ConsentTokenResponse>>> getCompanyConsents(
            @RequestHeader("X-User-Id") String companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ConsentTokenResponse> consents = consentService.getCompanyConsents(companyId, page, size);
        return ResponseEntity.ok(ApiResponse.success(consents));
    }
}
