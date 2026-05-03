package com.layerlab.backend.dto.request;

import com.layerlab.backend.entity.LoyaltyLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyOfferRequest {

    @NotNull(message = "Le niveau de fidélité est obligatoire")
    private LoyaltyLevel level;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "Le pourcentage de remise est obligatoire")
    @Min(value = 1, message = "Le pourcentage de remise doit être au minimum 1")
    @Max(value = 100, message = "Le pourcentage de remise doit être au maximum 100")
    private Integer discountPercent;
}
