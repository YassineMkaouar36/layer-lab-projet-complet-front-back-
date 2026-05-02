package com.layerlab.backend.repository;

import com.layerlab.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySubCategoryId(Long subCategoryId);

    boolean existsBySubCategoryId(Long subCategoryId);

    long countByStockLessThanEqual(Integer threshold);
}
