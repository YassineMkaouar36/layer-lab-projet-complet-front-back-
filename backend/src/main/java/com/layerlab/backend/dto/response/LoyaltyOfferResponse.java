package com.layerlab.backend.dto.response;

import com.layerlab.backend.entity.LoyaltyLevel;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyOfferResponse {

    private Long id;
    private LoyaltyLevel level;
    private String description;
    private Integer discountPercent;
}
