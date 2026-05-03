package com.layerlab.backend.dto.response;

import com.layerlab.backend.entity.LoyaltyLevel;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyAccountResponse {

    private Integer points;
    private LoyaltyLevel level;
}
