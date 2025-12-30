package com.applyo.document.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "documents")
public class DocumentMetadata {

    @Id
    private String id;

    @Indexed
    private String ownerId;

    @Indexed
    private String ownerType; // candidate, company

    private String filename;
    private String originalFilename;
    private String contentType;
    private Long size;

    @Builder.Default
    private DocumentType documentType = DocumentType.OTHER;

    // GridFS file ID
    private String gridFsId;

    @Builder.Default
    private Boolean active = true;

    @CreatedDate
    private Instant uploadedAt;
}
