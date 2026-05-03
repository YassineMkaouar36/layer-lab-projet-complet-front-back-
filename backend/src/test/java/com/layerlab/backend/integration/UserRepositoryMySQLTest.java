package com.layerlab.backend.integration;

import com.layerlab.backend.entity.Role;
import com.layerlab.backend.entity.User;
import com.layerlab.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests d'intégration MySQL pour UserRepository.
 * Validates: Requirements 6.1, 6.2, 8.1, 8.4
 */
@MySQLIntegrationTest
class UserRepositoryMySQLTest {

    @Autowired
    private UserRepository userRepository;

    private User buildUser(String email) {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail(email);
        user.setPassword("secret");
        user.setRole(Role.ROLE_USER);
        return user;
    }

    /**
     * Validates: Requirement 8.4
     * WHEN un User est sauvegardé,
     * THE UserRepository SHALL renseigner automatiquement le champ createdAt via @CreationTimestamp.
     */
    @Test
    void save_shouldPopulateCreatedAt() {
        User saved = userRepository.save(buildUser("john@test.com"));
        assertNotNull(saved.getCreatedAt());
    }

    /**
     * Validates: Requirement 8.1
     * WHEN un User est sauvegardé sans spécifier active,
     * THE UserRepository SHALL persister active=true comme valeur par défaut.
     */
    @Test
    void save_shouldDefaultActiveToTrue() {
        User saved = userRepository.save(buildUser("jane@test.com"));
        assertTrue(saved.getActive());
    }

    /**
     * Validates: Requirement 6.1
     * WHEN findByEmail() est appelé avec un email existant,
     * THE UserRepository SHALL retourner un Optional contenant l'utilisateur correspondant.
     */
    @Test
    void findByEmail_existingEmail_shouldReturnNonEmptyOptional() {
        userRepository.save(buildUser("existing@test.com"));
        Optional<User> result = userRepository.findByEmail("existing@test.com");
        assertTrue(result.isPresent());
    }

    /**
     * Validates: Requirement 6.2
     * WHEN findByEmail() est appelé avec un email inexistant,
     * THE UserRepository SHALL retourner un Optional vide.
     */
    @Test
    void findByEmail_unknownEmail_shouldReturnEmptyOptional() {
        Optional<User> result = userRepository.findByEmail("unknown@test.com");
        assertTrue(result.isEmpty());
    }
}
