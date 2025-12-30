package com.applyo.document.controller;

import com.applyo.document.dto.ApiResponse;
import com.applyo.document.dto.DocumentResponse;
import com.applyo.document.model.DocumentType;
import com.applyo.document.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Type", defaultValue = "candidate") String userType,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "OTHER") DocumentType documentType) {

        DocumentResponse response = documentService.uploadDocument(userId, userType, documentType, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocument(
            @PathVariable String documentId) {
        DocumentResponse response = documentService.getDocument(documentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable String documentId) {
        DocumentResponse metadata = documentService.getDocument(documentId);
        Resource resource = documentService.downloadDocument(documentId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + metadata.getOriginalFilename() + "\"")
                .body(resource);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getMyDocuments(
            @RequestHeader("X-User-Id") String userId) {
        List<DocumentResponse> documents = documentService.getOwnerDocuments(userId);
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getMyDocumentsByType(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable DocumentType type) {
        List<DocumentResponse> documents = documentService.getOwnerDocumentsByType(userId, type);
        return ResponseEntity.ok(ApiResponse.success(documents));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String documentId) {
        documentService.deleteDocument(userId, documentId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
