package com.layerlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "promo_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private Integer discountPercent;

    @Column(nullable = false)
    private LocalDate validUntil;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
