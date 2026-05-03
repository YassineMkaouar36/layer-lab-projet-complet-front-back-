package com.layerlab.backend.dto.response;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeResponse {

    private Long id;
    private String code;
    private Integer discountPercent;
    private LocalDate validUntil;
    private Boolean active;
}
