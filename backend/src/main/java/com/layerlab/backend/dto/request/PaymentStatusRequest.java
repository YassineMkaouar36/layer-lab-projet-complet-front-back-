package com.layerlab.backend.dto.request;

import com.layerlab.backend.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusRequest {

    @NotNull(message = "Le statut du paiement est obligatoire")
    private PaymentStatus status;
}
