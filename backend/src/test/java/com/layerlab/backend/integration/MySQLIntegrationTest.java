package com.layerlab.backend.integration;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Méta-annotation pour les tests d'intégration MySQL.
 * Combine @DataJpaTest, @ActiveProfiles("mysql-test") et
 * @AutoConfigureTestDatabase(replace = NONE) pour pointer sur MySQL réel.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@DataJpaTest
@ActiveProfiles("mysql-test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public @interface MySQLIntegrationTest {
}
