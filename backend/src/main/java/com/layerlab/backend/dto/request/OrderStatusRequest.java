package com.layerlab.backend.dto.request;

import com.layerlab.backend.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusRequest {

    @NotNull(message = "Le statut de la commande est obligatoire")
    private OrderStatus status;
}
