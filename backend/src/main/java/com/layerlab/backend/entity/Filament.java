package com.layerlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "filaments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Filament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Integer stockGrams;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer alertThreshold = 500;
}
