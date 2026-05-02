package com.layerlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loyalty_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Integer points = 0;

    /**
     * Calculates the loyalty level dynamically based on points.
     * BRONZE: [0–499], SILVER: [500–1999], GOLD: [≥2000]
     */
    @Transient
    public LoyaltyLevel getLevel() {
        if (points == null || points < 500) {
            return LoyaltyLevel.BRONZE;
        } else if (points < 2000) {
            return LoyaltyLevel.SILVER;
        } else {
            return LoyaltyLevel.GOLD;
        }
    }
}
