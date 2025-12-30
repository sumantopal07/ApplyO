package com.applyo.company.service;

import com.applyo.company.dto.*;
import com.applyo.company.exception.CompanyNotFoundException;
import com.applyo.company.exception.DuplicateEmailException;
import com.applyo.company.model.ApiKey;
import com.applyo.company.model.Company;
import com.applyo.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public CompanyResponse createCompany(CreateCompanyRequest request) {
        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        Company company = Company.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .email(request.getEmail())
                .website(request.getWebsite())
                .industry(request.getIndustry())
                .size(request.getSize())
                .build();

        company = companyRepository.save(company);
        return mapToResponse(company);
    }

    public CompanyResponse getCompany(String userId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));
        return mapToResponse(company);
    }

    public CompanyResponse getCompanyById(String id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));
        return mapToResponse(company);
    }

    public CompanyResponse updateCompany(String userId, UpdateCompanyRequest request) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));

        if (request.getName() != null) company.setName(request.getName());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite());
        if (request.getIndustry() != null) company.setIndustry(request.getIndustry());
        if (request.getSize() != null) company.setSize(request.getSize());
        if (request.getDescription() != null) company.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) company.setLogoUrl(request.getLogoUrl());
        if (request.getLocation() != null) company.setLocation(request.getLocation());
        if (request.getDataRetentionPolicy() != null) company.setDataRetentionPolicy(request.getDataRetentionPolicy());
        if (request.getPrivacyPolicyUrl() != null) company.setPrivacyPolicyUrl(request.getPrivacyPolicyUrl());

        company = companyRepository.save(company);
        return mapToResponse(company);
    }

    // API Key Management
    public ApiKeyCreatedResponse createApiKey(String userId, CreateApiKeyRequest request) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));

        // Generate API key
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String apiKey = "ao_" + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        String prefix = apiKey.substring(0, 11); // ao_ + first 8 chars

        ApiKey newKey = ApiKey.builder()
                .id(UUID.randomUUID().toString())
                .keyHash(hashApiKey(apiKey))
                .name(request.getName())
                .prefix(prefix)
                .scopes(request.getScopes() != null ? request.getScopes() : List.of("read:candidates"))
                .rateLimit(request.getRateLimit() != null ? request.getRateLimit() : 60)
                .expiresAt(request.getExpiresAt())
                .createdAt(Instant.now())
                .build();

        company.getApiKeys().add(newKey);
        companyRepository.save(company);

        return ApiKeyCreatedResponse.builder()
                .id(newKey.getId())
                .name(newKey.getName())
                .apiKey(apiKey) // Only returned once
                .prefix(newKey.getPrefix())
                .scopes(newKey.getScopes())
                .rateLimit(newKey.getRateLimit())
                .build();
    }

    public void revokeApiKey(String userId, String keyId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));

        company.getApiKeys().stream()
                .filter(k -> k.getId().equals(keyId))
                .findFirst()
                .ifPresent(k -> k.setActive(false));

        companyRepository.save(company);
    }

    public void deleteApiKey(String userId, String keyId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));

        company.getApiKeys().removeIf(k -> k.getId().equals(keyId));
        companyRepository.save(company);
    }

    // Webhook Management
    public CompanyResponse addWebhook(String userId, String webhookUrl) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));

        if (!company.getWebhookUrls().contains(webhookUrl)) {
            company.getWebhookUrls().add(webhookUrl);
            company = companyRepository.save(company);
        }

        return mapToResponse(company);
    }

    public CompanyResponse removeWebhook(String userId, String webhookUrl) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new CompanyNotFoundException("Company not found"));

        company.getWebhookUrls().remove(webhookUrl);
        company = companyRepository.save(company);
        return mapToResponse(company);
    }

    private String hashApiKey(String apiKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(apiKey.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash API key", e);
        }
    }

    private CompanyResponse mapToResponse(Company company) {
        List<ApiKeyResponse> apiKeyResponses = company.getApiKeys().stream()
                .map(this::mapApiKeyToResponse)
                .collect(Collectors.toList());

        return CompanyResponse.builder()
                .id(company.getId())
                .userId(company.getUserId())
                .name(company.getName())
                .email(company.getEmail())
                .website(company.getWebsite())
                .industry(company.getIndustry())
                .size(company.getSize())
                .description(company.getDescription())
                .logoUrl(company.getLogoUrl())
                .location(company.getLocation())
                .verified(company.getVerified())
                .subscriptionTier(company.getSubscriptionTier())
                .apiKeys(apiKeyResponses)
                .webhookUrls(company.getWebhookUrls())
                .dataRetentionPolicy(company.getDataRetentionPolicy())
                .privacyPolicyUrl(company.getPrivacyPolicyUrl())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

    private ApiKeyResponse mapApiKeyToResponse(ApiKey apiKey) {
        return ApiKeyResponse.builder()
                .id(apiKey.getId())
                .name(apiKey.getName())
                .prefix(apiKey.getPrefix())
                .scopes(apiKey.getScopes())
                .rateLimit(apiKey.getRateLimit())
                .active(apiKey.getActive())
                .expiresAt(apiKey.getExpiresAt())
                .lastUsedAt(apiKey.getLastUsedAt())
                .createdAt(apiKey.getCreatedAt())
                .build();
    }
}
