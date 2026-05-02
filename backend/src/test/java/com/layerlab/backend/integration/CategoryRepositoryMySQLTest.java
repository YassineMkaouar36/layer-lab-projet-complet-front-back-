package com.layerlab.backend.integration;

import com.layerlab.backend.entity.Category;
import com.layerlab.backend.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests d'intégration MySQL pour CategoryRepository.
 * Validates: Requirements 3.1, 3.3
 */
@MySQLIntegrationTest
class CategoryRepositoryMySQLTest {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Validates: Requirement 3.1
     * WHEN une Category est sauvegardée avec un nom unique,
     * THE CategoryRepository SHALL retourner l'entité avec un id généré automatiquement.
     */
    @Test
    void save_shouldGenerateId() {
        Category saved = categoryRepository.save(new Category("Electronics"));
        assertNotNull(saved.getId());
    }

    /**
     * Validates: Requirement 3.3
     * WHEN deux Category avec le même name sont sauvegardées,
     * THE CategoryRepository SHALL lever une DataIntegrityViolationException.
     */
    @Test
    void save_duplicateName_shouldThrowDataIntegrityViolationException() {
        categoryRepository.saveAndFlush(new Category("Duplicate"));
        assertThrows(DataIntegrityViolationException.class, () ->
            categoryRepository.saveAndFlush(new Category("Duplicate"))
        );
    }
}
