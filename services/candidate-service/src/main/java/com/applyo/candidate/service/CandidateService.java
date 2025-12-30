package com.applyo.candidate.service;

import com.applyo.candidate.dto.*;
import com.applyo.candidate.exception.CandidateNotFoundException;
import com.applyo.candidate.exception.DuplicateEmailException;
import com.applyo.candidate.model.Candidate;
import com.applyo.candidate.model.Education;
import com.applyo.candidate.model.Experience;
import com.applyo.candidate.model.Skill;
import com.applyo.candidate.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateResponse createCandidate(CreateCandidateRequest request) {
        if (candidateRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        Candidate candidate = Candidate.builder()
                .userId(request.getUserId())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .build();

        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    public CandidateResponse getProfile(String userId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));
        return mapToResponse(candidate);
    }

    public CandidateResponse getProfileByEmail(String email) {
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));
        return mapToResponse(candidate);
    }

    public CandidateResponse getProfileById(String id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));
        return mapToResponse(candidate);
    }

    public CandidateResponse updateProfile(String userId, UpdateProfileRequest request) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));

        if (request.getFullName() != null) candidate.setFullName(request.getFullName());
        if (request.getPhone() != null) candidate.setPhone(request.getPhone());
        if (request.getHeadline() != null) candidate.setHeadline(request.getHeadline());
        if (request.getLocation() != null) candidate.setLocation(request.getLocation());
        if (request.getAbout() != null) candidate.setAbout(request.getAbout());
        if (request.getLinkedinUrl() != null) candidate.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getGithubUrl() != null) candidate.setGithubUrl(request.getGithubUrl());
        if (request.getPortfolioUrl() != null) candidate.setPortfolioUrl(request.getPortfolioUrl());

        calculateProfileCompletion(candidate);
        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    // Education methods
    public CandidateResponse addEducation(String userId, EducationRequest request) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));

        Education education = Education.builder()
                .id(UUID.randomUUID().toString())
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .startYear(request.getStartYear())
                .endYear(request.getEndYear())
                .grade(request.getGrade())
                .description(request.getDescription())
                .build();

        candidate.getEducation().add(education);
        calculateProfileCompletion(candidate);
        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    public CandidateResponse deleteEducation(String userId, String educationId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));

        candidate.getEducation().removeIf(e -> e.getId().equals(educationId));
        calculateProfileCompletion(candidate);
        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    // Experience methods
    public CandidateResponse addExperience(String userId, ExperienceRequest request) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));

        Experience experience = Experience.builder()
                .id(UUID.randomUUID().toString())
                .companyName(request.getCompanyName())
                .role(request.getRole())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .current(request.getCurrent())
                .description(request.getDescription())
                .employmentType(request.getEmploymentType())
                .build();

        candidate.getExperience().add(experience);
        calculateProfileCompletion(candidate);
        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    public CandidateResponse deleteExperience(String userId, String experienceId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));

        candidate.getExperience().removeIf(e -> e.getId().equals(experienceId));
        calculateProfileCompletion(candidate);
        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    // Skills methods
    public CandidateResponse addSkills(String userId, SkillsRequest request) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));

        List<Skill> newSkills = request.getSkills().stream()
                .map(skillName -> Skill.builder()
                        .id(UUID.randomUUID().toString())
                        .name(skillName)
                        .category(request.getCategory())
                        .proficiency(request.getProficiency())
                        .build())
                .toList();

        candidate.getSkills().addAll(newSkills);
        calculateProfileCompletion(candidate);
        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    public CandidateResponse deleteSkill(String userId, String skillId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new CandidateNotFoundException("Candidate not found"));

        candidate.getSkills().removeIf(s -> s.getId().equals(skillId));
        calculateProfileCompletion(candidate);
        candidate = candidateRepository.save(candidate);
        return mapToResponse(candidate);
    }

    private void calculateProfileCompletion(Candidate candidate) {
        int score = 0;
        int total = 9;

        if (candidate.getFullName() != null && !candidate.getFullName().isEmpty()) score++;
        if (candidate.getPhone() != null && !candidate.getPhone().isEmpty()) score++;
        if (candidate.getHeadline() != null && !candidate.getHeadline().isEmpty()) score++;
        if (candidate.getLocation() != null && !candidate.getLocation().isEmpty()) score++;
        if (candidate.getAbout() != null && !candidate.getAbout().isEmpty()) score++;
        if (!candidate.getEducation().isEmpty()) score++;
        if (!candidate.getExperience().isEmpty()) score++;
        if (!candidate.getSkills().isEmpty()) score++;
        if (!candidate.getDocumentIds().isEmpty()) score++;

        candidate.setProfileCompletionPercentage((score * 100) / total);
        candidate.setProfileComplete(score == total);
    }

    private CandidateResponse mapToResponse(Candidate candidate) {
        return CandidateResponse.builder()
                .id(candidate.getId())
                .userId(candidate.getUserId())
                .email(candidate.getEmail())
                .fullName(candidate.getFullName())
                .phone(candidate.getPhone())
                .headline(candidate.getHeadline())
                .location(candidate.getLocation())
                .about(candidate.getAbout())
                .linkedinUrl(candidate.getLinkedinUrl())
                .githubUrl(candidate.getGithubUrl())
                .portfolioUrl(candidate.getPortfolioUrl())
                .education(candidate.getEducation())
                .experience(candidate.getExperience())
                .skills(candidate.getSkills())
                .documentIds(candidate.getDocumentIds())
                .profileComplete(candidate.getProfileComplete())
                .profileCompletionPercentage(candidate.getProfileCompletionPercentage())
                .createdAt(candidate.getCreatedAt())
                .updatedAt(candidate.getUpdatedAt())
                .build();
    }
}
