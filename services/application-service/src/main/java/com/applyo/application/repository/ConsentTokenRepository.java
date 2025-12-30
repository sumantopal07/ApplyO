package com.applyo.application.repository;

import com.applyo.application.model.ConsentToken;
import com.applyo.application.model.ConsentTokenStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsentTokenRepository extends MongoRepository<ConsentToken, String> {

    Optional<ConsentToken> findByToken(String token);

    Page<ConsentToken> findByCandidateId(String candidateId, Pageable pageable);

    Page<ConsentToken> findByCandidateIdAndStatus(String candidateId, ConsentTokenStatus status, Pageable pageable);

    Page<ConsentToken> findByCompanyId(String companyId, Pageable pageable);
}
