package com.applyo.company.repository;

import com.applyo.company.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    Page<Job> findByCompanyId(String companyId, Pageable pageable);

    List<Job> findByCompanyIdAndStatus(String companyId, String status);

    Page<Job> findByStatus(String status, Pageable pageable);

    long countByCompanyId(String companyId);
}
