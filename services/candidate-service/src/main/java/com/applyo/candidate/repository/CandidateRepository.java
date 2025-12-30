package com.applyo.candidate.repository;

import com.applyo.candidate.model.Candidate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateRepository extends MongoRepository<Candidate, String> {

    Optional<Candidate> findByUserId(String userId);

    Optional<Candidate> findByEmail(String email);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);
}
