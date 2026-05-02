# Requirements Document

## Introduction

Ce document définit les exigences pour les tests d'intégration MySQL du backend LayerLab (Spring Boot 3.2.5 / Java 17).
L'objectif est de valider que l'application se connecte correctement à une base MySQL réelle (localhost:3306/layerlab_db),
que Hibernate génère automatiquement le schéma depuis les entités JPA, que toutes les relations entre entités sont
correctement mappées, et que les opérations CRUD de base fonctionnent via les repositories Spring Data JPA.

Ces tests s'exécutent avec un profil dédié `mysql-test` qui pointe sur MySQL au lieu de H2.

## Glossary

- **MySQLTestContext**: Contexte Spring Boot de test configuré avec le profil `mysql-test` pointant sur `jdbc:mysql://localhost:3306/layerlab_db`
- **SchemaValidator**: Mécanisme Hibernate (`ddl-auto=create-drop`) qui crée et supprime le schéma autour des tests
- **Repository**: Interface Spring Data JPA (`JpaRepository`) exposant les opérations CRUD et les requêtes dérivées
- **Entity**: Classe Java annotée `@Entity` mappée sur une table MySQL via Hibernate
- **Relation**: Association JPA entre entités (`@ManyToOne`, `@OneToOne`, `@OneToMany`, `@ManyToMany`)
- **IntegrationTest**: Test Spring Boot annoté `@SpringBootTest` ou `@DataJpaTest` qui charge le contexte réel
- **TransactionManager**: Gestionnaire de transactions Spring qui garantit l'atomicité des opérations

---

## Requirements

### Requirement 1 : Connexion MySQL réelle

**User Story:** En tant que développeur, je veux que les tests d'intégration se connectent à MySQL réel, afin de valider le comportement de l'application en conditions proches de la production.

#### Acceptance Criteria

1. WHEN le profil `mysql-test` est actif, THE MySQLTestContext SHALL se connecter à `jdbc:mysql://localhost:3306/layerlab_db` avec les credentials `root/root`
2. WHEN la connexion est établie, THE MySQLTestContext SHALL utiliser le driver `com.mysql.cj.jdbc.Driver`
3. IF la base de données `layerlab_db` est inaccessible, THEN THE MySQLTestContext SHALL échouer avec une `DataSourceException` descriptive au démarrage du contexte
4. THE MySQLTestContext SHALL utiliser `ddl-auto=create-drop` pour créer le schéma avant les tests et le supprimer après

---

### Requirement 2 : Génération automatique du schéma

**User Story:** En tant que développeur, je veux que Hibernate génère automatiquement toutes les tables depuis les entités JPA, afin de vérifier que le mapping objet-relationnel est cohérent avec MySQL.

#### Acceptance Criteria

1. WHEN le contexte Spring démarre avec `ddl-auto=create-drop`, THE SchemaValidator SHALL créer les tables suivantes dans MySQL : `users`, `categories`, `subcategories`, `products`, `product_customizations`, `filaments`, `orders`, `order_items`, `payments`, `promo_codes`, `reviews`, `loyalty_accounts`, `loyalty_offers`, `machines`, `files`
2. WHEN toutes les tables sont créées, THE SchemaValidator SHALL créer les colonnes avec les contraintes `NOT NULL`, `UNIQUE` et les types de données définis dans les entités JPA
3. WHEN les tests sont terminés, THE SchemaValidator SHALL supprimer toutes les tables créées sans laisser de résidus dans la base
4. IF une entité contient une contrainte invalide pour MySQL, THEN THE SchemaValidator SHALL lever une `SchemaManagementException` avec le détail de la contrainte en erreur

---

### Requirement 3 : Mapping des entités indépendantes

**User Story:** En tant que développeur, je veux tester le CRUD des entités sans dépendances externes, afin de valider le mapping de base de chaque table.

#### Acceptance Criteria

1. WHEN une `Category` est sauvegardée avec un nom unique, THE CategoryRepository SHALL retourner l'entité avec un `id` généré automatiquement par MySQL (`AUTO_INCREMENT`)
2. WHEN une `Category` est sauvegardée puis rechargée par son `id`, THE CategoryRepository SHALL retourner une entité dont le champ `name` est identique à celui sauvegardé (propriété round-trip)
3. WHEN deux `Category` avec le même `name` sont sauvegardées, THE CategoryRepository SHALL lever une `DataIntegrityViolationException` due à la contrainte `UNIQUE`
4. WHEN un `Filament` est sauvegardé, THE FilamentRepository SHALL persister les champs `color`, `type`, `stockGrams`, `available` et `alertThreshold` avec leurs valeurs par défaut (`available=true`, `alertThreshold=500`)
5. WHEN une `Machine` est sauvegardée avec un `MachineStatus`, THE MachineRepository SHALL persister la valeur de l'enum en tant que `VARCHAR` dans MySQL
6. WHEN un `PromoCode` est sauvegardé avec un `code` unique, THE PromoCodeRepository SHALL persister les champs `discountPercent`, `validUntil` et `active`
7. WHEN un `LoyaltyOffer` est sauvegardé avec un `LoyaltyLevel`, THE LoyaltyOfferRepository SHALL persister la valeur de l'enum `level` en tant que `VARCHAR`

---

### Requirement 4 : Mapping des relations ManyToOne

**User Story:** En tant que développeur, je veux tester les relations ManyToOne entre entités, afin de valider que les clés étrangères sont correctement créées et respectées par MySQL.

#### Acceptance Criteria

1. WHEN une `SubCategory` est sauvegardée avec une `Category` existante, THE SubCategoryRepository SHALL persister la clé étrangère `category_id` dans la table `subcategories`
2. WHEN un `Product` est sauvegardé avec une `SubCategory` existante, THE ProductRepository SHALL persister la clé étrangère `sub_category_id` dans la table `products`
3. WHEN un `Order` est sauvegardé avec un `User` existant, THE OrderRepository SHALL persister la clé étrangère `user_id` dans la table `orders`
4. WHEN un `OrderItem` est sauvegardé avec un `Order` et un `Product` existants, THE OrderItemRepository SHALL persister les clés étrangères `order_id` et `product_id`
5. WHEN une `Review` est sauvegardée avec un `Product` et un `User` existants, THE ReviewRepository SHALL persister les clés étrangères `product_id` et `user_id`
6. WHEN une `ProductCustomization` est sauvegardée avec un `Product` et un `User` existants, THE ProductCustomizationRepository SHALL persister les clés étrangères `product_id` et `user_id`
7. WHEN un `FileEntity` est sauvegardé avec un `User` existant, THE FileEntityRepository SHALL persister la clé étrangère `uploaded_by_id`
8. IF une `SubCategory` est sauvegardée avec un `category_id` inexistant, THEN THE SubCategoryRepository SHALL lever une `DataIntegrityViolationException` due à la contrainte de clé étrangère

---

### Requirement 5 : Mapping des relations OneToOne

**User Story:** En tant que développeur, je veux tester les relations OneToOne entre entités, afin de valider l'unicité des associations et les contraintes MySQL correspondantes.

#### Acceptance Criteria

1. WHEN un `LoyaltyAccount` est sauvegardé avec un `User` existant, THE LoyaltyAccountRepository SHALL persister la clé étrangère `user_id` avec une contrainte `UNIQUE` dans la table `loyalty_accounts`
2. WHEN un `Payment` est sauvegardé avec un `Order` existant, THE PaymentRepository SHALL persister la clé étrangère `order_id` avec une contrainte `UNIQUE` dans la table `payments`
3. IF un second `LoyaltyAccount` est sauvegardé avec le même `User`, THEN THE LoyaltyAccountRepository SHALL lever une `DataIntegrityViolationException` due à la contrainte `UNIQUE` sur `user_id`
4. IF un second `Payment` est sauvegardé avec le même `Order`, THEN THE PaymentRepository SHALL lever une `DataIntegrityViolationException` due à la contrainte `UNIQUE` sur `order_id`

---

### Requirement 6 : Requêtes dérivées des repositories

**User Story:** En tant que développeur, je veux tester les méthodes de requête dérivées des repositories, afin de valider que Spring Data JPA génère des requêtes SQL correctes pour MySQL.

#### Acceptance Criteria

1. WHEN `UserRepository.findByEmail(email)` est appelé avec un email existant, THE UserRepository SHALL retourner un `Optional` contenant l'utilisateur correspondant
2. WHEN `UserRepository.findByEmail(email)` est appelé avec un email inexistant, THE UserRepository SHALL retourner un `Optional` vide
3. WHEN `UserRepository.existsByEmail(email)` est appelé, THE UserRepository SHALL retourner `true` si l'email existe et `false` sinon
4. WHEN `ProductRepository.findBySubCategoryId(id)` est appelé, THE ProductRepository SHALL retourner uniquement les produits appartenant à la sous-catégorie spécifiée
5. WHEN `ProductRepository.countByStockLessThanEqual(threshold)` est appelé, THE ProductRepository SHALL retourner le nombre exact de produits dont le stock est inférieur ou égal au seuil
6. WHEN `OrderRepository.findByUserId(userId)` est appelé, THE OrderRepository SHALL retourner toutes les commandes de l'utilisateur spécifié
7. WHEN `OrderRepository.findByStatus(status)` est appelé, THE OrderRepository SHALL retourner uniquement les commandes ayant le statut spécifié
8. WHEN `OrderRepository.countByStatus(status)` est appelé, THE OrderRepository SHALL retourner le nombre exact de commandes ayant ce statut

---

### Requirement 7 : Comportement transactionnel

**User Story:** En tant que développeur, je veux tester le comportement transactionnel de JPA avec MySQL, afin de valider que les rollbacks et commits fonctionnent correctement.

#### Acceptance Criteria

1. WHEN une transaction est commitée après la sauvegarde d'un `User`, THE TransactionManager SHALL rendre l'entité visible aux transactions suivantes
2. WHEN une transaction est rollbackée après la sauvegarde d'un `User`, THE TransactionManager SHALL ne pas persister l'entité dans MySQL
3. WHEN plusieurs entités liées sont sauvegardées dans la même transaction, THE TransactionManager SHALL persister toutes les entités ou aucune en cas d'erreur
4. WHEN `@Transactional` est utilisé sur un test, THE TransactionManager SHALL effectuer un rollback automatique après chaque test pour garantir l'isolation

---

### Requirement 8 : Valeurs par défaut et champs auto-générés

**User Story:** En tant que développeur, je veux vérifier que les valeurs par défaut et les champs auto-générés sont correctement gérés par MySQL et Hibernate.

#### Acceptance Criteria

1. WHEN un `User` est sauvegardé sans spécifier `active`, THE UserRepository SHALL persister `active=true` comme valeur par défaut
2. WHEN un `Order` est sauvegardé sans spécifier `status`, THE OrderRepository SHALL persister `status=PREPARING` comme valeur par défaut
3. WHEN un `Order` est sauvegardé sans spécifier `delivery`, THE OrderRepository SHALL persister `delivery=false` comme valeur par défaut
4. WHEN un `User` est sauvegardé, THE UserRepository SHALL renseigner automatiquement le champ `createdAt` via `@CreationTimestamp`
5. WHEN un `Order` est sauvegardé, THE OrderRepository SHALL renseigner automatiquement le champ `createdAt` via `@CreationTimestamp`
6. WHEN un `Payment` est sauvegardé sans spécifier `status`, THE PaymentRepository SHALL persister `status=PENDING` comme valeur par défaut
7. WHEN un `LoyaltyAccount` est sauvegardé sans spécifier `points`, THE LoyaltyAccountRepository SHALL persister `points=0` comme valeur par défaut

---

### Requirement 9 : Logique métier transiente

**User Story:** En tant que développeur, je veux tester la logique métier calculée de `LoyaltyAccount`, afin de valider que le niveau de fidélité est correctement dérivé des points persistés en base.

#### Acceptance Criteria

1. WHEN un `LoyaltyAccount` est rechargé depuis MySQL avec `points < 500`, THE LoyaltyAccount SHALL retourner `LoyaltyLevel.BRONZE` via `getLevel()`
2. WHEN un `LoyaltyAccount` est rechargé depuis MySQL avec `500 <= points < 2000`, THE LoyaltyAccount SHALL retourner `LoyaltyLevel.SILVER` via `getLevel()`
3. WHEN un `LoyaltyAccount` est rechargé depuis MySQL avec `points >= 2000`, THE LoyaltyAccount SHALL retourner `LoyaltyLevel.GOLD` via `getLevel()`
4. THE LoyaltyAccount SHALL ne pas persister le champ `level` dans MySQL car il est annoté `@Transient`
5. FOR ALL valeurs de `points >= 0`, appeler `getLevel()` deux fois sur le même objet SHALL retourner la même valeur (propriété idempotence)
