package com.applyo.document.dto;

import com.applyo.document.model.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {

    private String id;
    private String ownerId;
    private String filename;
    private String originalFilename;
    private String contentType;
    private Long size;
    private DocumentType documentType;
    private Instant uploadedAt;
    private String downloadUrl;
}
