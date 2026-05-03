package com.layerlab.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorageInfoResponse {

    private Long usedBytes;
    private Long availableBytes;
}
