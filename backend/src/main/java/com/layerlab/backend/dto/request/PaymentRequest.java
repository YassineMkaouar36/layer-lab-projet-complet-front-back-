package com.layerlab.backend.dto.request;

import com.layerlab.backend.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "L'identifiant de la commande est obligatoire")
    private Long orderId;

    @NotNull(message = "La méthode de paiement est obligatoire")
    private PaymentMethod method;

    // Optional promo code
    private String promoCode;
}
