package com.applyo.application.repository;

import com.applyo.application.model.Application;
import com.applyo.application.model.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {

    Page<Application> findByCandidateId(String candidateId, Pageable pageable);

    Page<Application> findByJobId(String jobId, Pageable pageable);

    Page<Application> findByCompanyId(String companyId, Pageable pageable);

    Page<Application> findByJobIdAndStatus(String jobId, ApplicationStatus status, Pageable pageable);

    Optional<Application> findByCandidateIdAndJobId(String candidateId, String jobId);

    boolean existsByCandidateIdAndJobId(String candidateId, String jobId);

    long countByJobId(String jobId);

    long countByCompanyId(String companyId);

    long countByCandidateId(String candidateId);

    long countByCandidateIdAndStatus(String candidateId, ApplicationStatus status);
}
