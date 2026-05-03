package com.layerlab.backend.dto.response;

import com.layerlab.backend.entity.PaymentMethod;
import com.layerlab.backend.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime createdAt;
}
