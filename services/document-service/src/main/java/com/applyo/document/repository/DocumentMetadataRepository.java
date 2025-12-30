package com.applyo.document.repository;

import com.applyo.document.model.DocumentMetadata;
import com.applyo.document.model.DocumentType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentMetadataRepository extends MongoRepository<DocumentMetadata, String> {

    List<DocumentMetadata> findByOwnerIdAndActiveTrue(String ownerId);

    List<DocumentMetadata> findByOwnerIdAndDocumentTypeAndActiveTrue(String ownerId, DocumentType documentType);

    long countByOwnerId(String ownerId);
}
