package com.layerlab.backend.repository;

import com.layerlab.backend.entity.ProductCustomization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductCustomizationRepository extends JpaRepository<ProductCustomization, Long> {

    Optional<ProductCustomization> findByProductIdAndUserId(Long productId, Long userId);

    List<ProductCustomization> findByUserId(Long userId);
}
