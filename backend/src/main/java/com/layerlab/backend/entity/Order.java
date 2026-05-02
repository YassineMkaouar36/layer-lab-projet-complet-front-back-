package com.layerlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PREPARING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;

    @Column(nullable = false)
    @Builder.Default
    private Boolean delivery = false;

    private String deliveryAddress;

    @Column(nullable = false)
    @Builder.Default
    private Integer priority = 3;

    private Integer estimatedWaitTime;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
