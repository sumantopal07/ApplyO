package com.applyo.company.controller;

import com.applyo.company.dto.*;
import com.applyo.company.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @Valid @RequestBody CreateCompanyRequest request) {
        CompanyResponse response = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyProfile(
            @RequestHeader("X-User-Id") String userId) {
        CompanyResponse response = companyService.getCompany(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @PathVariable String id) {
        CompanyResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UpdateCompanyRequest request) {
        CompanyResponse response = companyService.updateCompany(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // API Key endpoints
    @PostMapping("/api-keys")
    public ResponseEntity<ApiResponse<ApiKeyCreatedResponse>> createApiKey(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateApiKeyRequest request) {
        ApiKeyCreatedResponse response = companyService.createApiKey(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @PostMapping("/api-keys/{keyId}/revoke")
    public ResponseEntity<ApiResponse<Void>> revokeApiKey(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String keyId) {
        companyService.revokeApiKey(userId, keyId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/api-keys/{keyId}")
    public ResponseEntity<ApiResponse<Void>> deleteApiKey(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String keyId) {
        companyService.deleteApiKey(userId, keyId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Webhook endpoints
    @PostMapping("/webhooks")
    public ResponseEntity<ApiResponse<CompanyResponse>> addWebhook(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody Map<String, String> body) {
        CompanyResponse response = companyService.addWebhook(userId, body.get("url"));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @DeleteMapping("/webhooks")
    public ResponseEntity<ApiResponse<CompanyResponse>> removeWebhook(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String url) {
        CompanyResponse response = companyService.removeWebhook(userId, url);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
