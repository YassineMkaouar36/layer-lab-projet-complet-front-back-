package com.layerlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_customizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCustomization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String color;

    private String text;

    private String dimensions;
}
