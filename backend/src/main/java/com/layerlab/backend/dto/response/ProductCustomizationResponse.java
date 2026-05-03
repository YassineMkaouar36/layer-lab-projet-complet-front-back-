package com.layerlab.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCustomizationResponse {

    private Long id;
    private Long productId;
    private Long userId;
    private String color;
    private String text;
    private String dimensions;
}
