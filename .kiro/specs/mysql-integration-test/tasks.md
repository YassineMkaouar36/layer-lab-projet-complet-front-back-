# Implementation Plan: MySQL Integration Tests

## Overview

Mise en place des tests d'intégration MySQL pour les entités `User`, `Category` et `Product`.
Les tests utilisent le profil `mysql-test` avec `ddl-auto=create-drop` et une méta-annotation commune.

## Tasks

- [x] 1. Créer la configuration MySQL de test
  - Créer `backend/src/test/resources/application-mysql-test.properties` avec l'URL `jdbc:mysql://localhost:3306/layerlab_db`, driver `com.mysql.cj.jdbc.Driver`, credentials `root/root`, `ddl-auto=create-drop` et le dialecte MySQL
  - _Requirements: 1.1, 1.2, 1.4, 2.1_

- [x] 2. Créer la méta-annotation `@MySQLIntegrationTest`
  - Créer `backend/src/test/java/com/layerlab/backend/integration/MySQLIntegrationTest.java`
  - Annoter avec `@DataJpaTest`, `@ActiveProfiles("mysql-test")` et `@AutoConfigureTestDatabase(replace = NONE)`
  - _Requirements: 1.1, 7.4_

- [x] 3. Implémenter `CategoryRepositoryMySQLTest`
  - [x] 3.1 Écrire les tests d'exemple pour `CategoryRepository`
    - Test : `save()` → `id` non null (_Requirements: 3.1_)
    - Test : deux `Category` avec le même `name` → `DataIntegrityViolationException` (_Requirements: 3.3_)
    - _Requirements: 3.1, 3.3_
  - [ ]* 3.2 Écrire le test de propriété PBT — Property 1 : round-trip name
    - **Property 1 : Category name round-trip**
    - Pour tout `name` non-blank (`@ForAll @AlphaChars @StringLength(min=1, max=50)`), `save()` puis `findById()` retourne un `name` identique
    - `@Property(tries = 100)`, `@Tag("Feature: mysql-integration-test, Property 1: Category name round-trip")`
    - **Validates: Requirements 3.2**

- [x] 4. Checkpoint — Vérifier que les tests Category passent
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implémenter `UserRepositoryMySQLTest`
  - [x] 5.1 Écrire les tests d'exemple pour `UserRepository`
    - Test : `save()` → `createdAt` non null (_Requirements: 8.4_)
    - Test : `save()` → `active` vaut `true` par défaut (_Requirements: 8.1_)
    - Test : `findByEmail()` avec email existant → `Optional` non vide (_Requirements: 6.1_)
    - Test : `findByEmail()` avec email inconnu → `Optional.empty()` (_Requirements: 6.2_)
    - _Requirements: 6.1, 6.2, 8.1, 8.4_
  - [ ]* 5.2 Écrire le test de propriété PBT — Property 2 : existsByEmail cohérence
    - **Property 2 : existsByEmail cohérence**
    - Pour tout `localPart` alpha (`@ForAll @AlphaChars @StringLength(min=1, max=20)`), après `save()` avec `email = localPart + "@test.com"`, `existsByEmail(email)` retourne `true` ; pour un email jamais sauvegardé, retourne `false`
    - `@Property(tries = 100)`, `@Tag("Feature: mysql-integration-test, Property 2: existsByEmail cohérence")`
    - **Validates: Requirements 6.3**

- [ ] 6. Implémenter `ProductRepositoryMySQLTest`
  - [ ] 6.1 Écrire les tests d'exemple pour `ProductRepository`
    - Créer la chaîne `Category` → `SubCategory` → `Product` via `CategoryRepository` et `SubCategoryRepository`
    - Test : `save()` avec `SubCategory` → rechargement via `findById()` retourne `subCategory` non null (_Requirements: 4.2_)
    - _Requirements: 4.2_
  - [ ]* 6.2 Écrire le test de propriété PBT — Property 3 : findBySubCategoryId filtre correct
    - **Property 3 : findBySubCategoryId filtre correct**
    - Pour tout ensemble de produits sauvegardés sous une `SubCategory` donnée, `findBySubCategoryId(id)` retourne uniquement des produits dont `subCategory.id` correspond à l'id interrogé
    - `@Property(tries = 50)`, `@Tag("Feature: mysql-integration-test, Property 3: findBySubCategoryId filtre correct")`
    - **Validates: Requirements 6.4**

- [ ] 7. Checkpoint final — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Les tâches marquées `*` sont optionnelles (tests PBT) et peuvent être sautées pour un MVP rapide
- Chaque classe de test utilise `@MySQLIntegrationTest` (tâche 2) — créer la méta-annotation en premier
- Les tests nécessitent MySQL local sur `localhost:3306/layerlab_db` avec `root/root`
- Lancer uniquement les tests MySQL : `./mvnw test -Dspring.profiles.active=mysql-test -Dtest="*MySQLTest"`
- `@DataJpaTest` + `@Transactional` garantit le rollback automatique après chaque test
