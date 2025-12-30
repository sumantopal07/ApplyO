package com.applyo.document.service;

import com.applyo.document.dto.DocumentResponse;
import com.applyo.document.exception.DocumentNotFoundException;
import com.applyo.document.exception.DocumentStorageException;
import com.applyo.document.exception.InvalidDocumentException;
import com.applyo.document.model.DocumentMetadata;
import com.applyo.document.model.DocumentType;
import com.applyo.document.repository.DocumentMetadataRepository;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentMetadataRepository documentMetadataRepository;
    private final GridFsOperations gridFsOperations;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public DocumentResponse uploadDocument(
            String ownerId,
            String ownerType,
            DocumentType documentType,
            MultipartFile file) {

        validateFile(file);

        try {
            // Generate unique filename
            String extension = getFileExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID().toString() + extension;

            // Store file in GridFS
            InputStream inputStream = file.getInputStream();
            ObjectId gridFsId = gridFsOperations.store(
                    inputStream,
                    filename,
                    file.getContentType()
            );

            // Store metadata
            DocumentMetadata metadata = DocumentMetadata.builder()
                    .ownerId(ownerId)
                    .ownerType(ownerType)
                    .filename(filename)
                    .originalFilename(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .size(file.getSize())
                    .documentType(documentType)
                    .gridFsId(gridFsId.toString())
                    .build();

            metadata = documentMetadataRepository.save(metadata);
            return mapToResponse(metadata);

        } catch (IOException e) {
            log.error("Failed to upload document: {}", e.getMessage());
            throw new DocumentStorageException("Failed to upload document");
        }
    }

    public Resource downloadDocument(String documentId) {
        DocumentMetadata metadata = documentMetadataRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found"));

        if (!metadata.getActive()) {
            throw new DocumentNotFoundException("Document not found");
        }

        GridFSFile gridFsFile = gridFsOperations.findOne(
                new Query(Criteria.where("_id").is(new ObjectId(metadata.getGridFsId())))
        );

        if (gridFsFile == null) {
            throw new DocumentNotFoundException("Document file not found");
        }

        GridFsResource resource = gridFsOperations.getResource(gridFsFile);
        try {
            return new InputStreamResource(resource.getInputStream());
        } catch (IOException e) {
            throw new DocumentStorageException("Failed to retrieve document");
        }
    }

    public DocumentResponse getDocument(String documentId) {
        DocumentMetadata metadata = documentMetadataRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found"));

        if (!metadata.getActive()) {
            throw new DocumentNotFoundException("Document not found");
        }

        return mapToResponse(metadata);
    }

    public List<DocumentResponse> getOwnerDocuments(String ownerId) {
        return documentMetadataRepository.findByOwnerIdAndActiveTrue(ownerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<DocumentResponse> getOwnerDocumentsByType(String ownerId, DocumentType documentType) {
        return documentMetadataRepository.findByOwnerIdAndDocumentTypeAndActiveTrue(ownerId, documentType)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteDocument(String ownerId, String documentId) {
        DocumentMetadata metadata = documentMetadataRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found"));

        if (!metadata.getOwnerId().equals(ownerId)) {
            throw new DocumentNotFoundException("Document not found");
        }

        // Soft delete - just mark as inactive
        metadata.setActive(false);
        documentMetadataRepository.save(metadata);

        // Optionally delete from GridFS
        // gridFsOperations.delete(new Query(Criteria.where("_id").is(new ObjectId(metadata.getGridFsId()))));
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidDocumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidDocumentException("File size exceeds maximum limit of 10MB");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new InvalidDocumentException("File type not allowed. Allowed types: PDF, DOC, DOCX, JPG, PNG");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    private DocumentResponse mapToResponse(DocumentMetadata metadata) {
        return DocumentResponse.builder()
                .id(metadata.getId())
                .ownerId(metadata.getOwnerId())
                .filename(metadata.getFilename())
                .originalFilename(metadata.getOriginalFilename())
                .contentType(metadata.getContentType())
                .size(metadata.getSize())
                .documentType(metadata.getDocumentType())
                .uploadedAt(metadata.getUploadedAt())
                .downloadUrl("/api/v1/documents/" + metadata.getId() + "/download")
                .build();
    }
}
