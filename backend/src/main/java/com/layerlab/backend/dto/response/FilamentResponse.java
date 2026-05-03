package com.layerlab.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilamentResponse {

    private Long id;
    private String color;
    private String type;
    private Integer stockGrams;
    private Boolean available;
    private Boolean shortageAlert;
}
