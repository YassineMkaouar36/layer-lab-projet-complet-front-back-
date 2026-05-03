package com.layerlab.backend.dto.response;

import com.layerlab.backend.entity.OrderStatus;
import com.layerlab.backend.entity.OrderType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private List<OrderItemResponse> items;
    private OrderStatus status;
    private OrderType type;
    private Boolean delivery;
    private String deliveryAddress;
    private Integer priority;
    private Integer estimatedWaitTime;
    private LocalDateTime createdAt;
}
