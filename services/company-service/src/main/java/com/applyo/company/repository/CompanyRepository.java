package com.applyo.company.repository;

import com.applyo.company.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    Optional<Company> findByUserId(String userId);

    Optional<Company> findByEmail(String email);

    boolean existsByEmail(String email);
}
