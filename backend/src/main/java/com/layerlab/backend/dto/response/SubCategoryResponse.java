package com.layerlab.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryResponse {

    private Long id;
    private String name;
    private Long categoryId;
}
