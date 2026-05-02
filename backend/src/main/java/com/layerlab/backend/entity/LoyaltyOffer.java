package com.layerlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loyalty_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoyaltyLevel level;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer discountPercent;
}
