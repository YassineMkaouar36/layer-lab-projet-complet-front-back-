package com.layerlab.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {

    private Long id;
    private String originalName;
    private String storagePath;
    private Long size;
    private String fileType;
    private LocalDateTime uploadedAt;
}
