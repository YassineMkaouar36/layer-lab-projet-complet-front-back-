# Rapport des tâches complétées — LayerLab Backend

Date de génération : 12 avril 2026

---

## Tâche 1 — Configuration initiale du projet Spring Boot `[x]`

**Exigences couvertes :** 15.1, 15.2, 15.3

### Fichiers créés / modifiés

| Fichier | Description |
|---------|-------------|
| `backend/pom.xml` | Dépendances Maven : Spring Boot 3.x, Spring Web, Spring Data JPA, Spring Security, MySQL Connector, jjwt, SpringDoc OpenAPI, Hibernate Validator, Lombok, jqwik |
| `backend/src/main/resources/application.properties` | Configuration MySQL, JWT secret, CORS, paramètres JPA |
| `backend/src/test/resources/application.properties` | Configuration de test |

### Structure de packages créée

```
com.layerlab.backend/
├── config/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
│   ├── request/
│   └── response/
├── security/
└── exception/
```

---

## Tâche 2.1 — Créer les entités de base `[x]`

**Exigences couvertes :** 1.1, 2.1, 3.1, 5.1

### Fichiers créés

| Fichier | Table JPA | Champs principaux |
|---------|-----------|-------------------|
| `entity/Role.java` | — (enum) | `ROLE_USER`, `ROLE_ADMIN` |
| `entity/User.java` | `users` | id, firstName, lastName, email (unique), password, phone, address, role (enum Role), active, createdAt |
| `entity/Category.java` | `categories` | id, name (unique) |
| `entity/SubCategory.java` | `subcategories` | id, name, category (ManyToOne → Category) |
| `entity/Product.java` | `products` | id, name, description, price (BigDecimal), author, subCategory (ManyToOne), stock (défaut 0), stockAlertThreshold (défaut 5), averageRating (défaut 0.0) |
| `entity/Review.java` | `reviews` | id, product (ManyToOne), user (ManyToOne), rating, comment, createdAt |

### Conventions appliquées
- Lombok : `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`
- JPA : `@Entity`, `@Table`, `@GeneratedValue(IDENTITY)`, `FetchType.LAZY` sur les relations
- Timestamps : `@CreationTimestamp` avec `updatable = false`

---

## Tâche 2.2 — Créer les entités de fichiers et ressources `[x]`

**Exigences couvertes :** 6.1, 7.1, 8.1

### Fichiers créés

| Fichier | Table JPA | Champs principaux |
|---------|-----------|-------------------|
| `entity/MachineStatus.java` | — (enum) | `AVAILABLE`, `IN_USE`, `MAINTENANCE` |
| `entity/FileEntity.java` | `files` | id, originalName, storagePath, size (Long), fileType, uploadedBy (ManyToOne → User), uploadedAt |
| `entity/Machine.java` | `machines` | id, name, status (enum MachineStatus), lastMaintenanceDate (LocalDate) |
| `entity/Filament.java` | `filaments` | id, color, type, stockGrams, available (défaut true), alertThreshold (défaut 500) |

---

## Tâche 2.3 — Créer les entités de commandes et paiements `[x]`

**Exigences couvertes :** 9.1, 10.1, 11.1

### Fichiers créés

#### Enums

| Fichier | Valeurs |
|---------|---------|
| `entity/OrderStatus.java` | `PREPARING`, `READY`, `DELIVERING`, `DELIVERED` |
| `entity/OrderType.java` | `ONLINE`, `PHONE` |
| `entity/PaymentMethod.java` | `CASH`, `BANK_TRANSFER` |
| `entity/PaymentStatus.java` | `PENDING`, `PAID`, `CANCELLED` |

#### Entités JPA

| Fichier | Table JPA | Champs principaux |
|---------|-----------|-------------------|
| `entity/Order.java` | `orders` | id, user (ManyToOne → User), status (enum OrderStatus, défaut PREPARING), type (enum OrderType), delivery (défaut false), deliveryAddress, priority (défaut 3), estimatedWaitTime, createdAt |
| `entity/OrderItem.java` | `order_items` | id, order (ManyToOne → Order), product (ManyToOne → Product), quantity, unitPrice (BigDecimal) |
| `entity/Payment.java` | `payments` | id, order (OneToOne → Order, unique), amount (BigDecimal), method (enum PaymentMethod), status (enum PaymentStatus, défaut PENDING), createdAt |
| `entity/PromoCode.java` | `promo_codes` | id, code (unique), discountPercent, validUntil (LocalDate), active (défaut true) |

### Points notables
- `Payment.order` est une relation `@OneToOne` avec contrainte `unique = true` sur la colonne `order_id`
- `Order.priority` initialisé à 3 (milieu de l'intervalle [1–5] défini en exigence 9.7)
- Tous les enums sont stockés en base avec `@Enumerated(EnumType.STRING)` pour la lisibilité

---

## Récapitulatif global

| Tâche | Statut | Fichiers créés |
|-------|--------|----------------|
| 1. Configuration initiale | ✅ Complété | pom.xml, application.properties |
| 2.1 Entités de base | ✅ Complété | Role, User, Category, SubCategory, Product, Review |
| 2.2 Entités fichiers & ressources | ✅ Complété | MachineStatus, FileEntity, Machine, Filament |
| 2.3 Entités commandes & paiements | ✅ Complété | OrderStatus, OrderType, PaymentMethod, PaymentStatus, Order, OrderItem, Payment, PromoCode |

**Total fichiers Java créés : 18**

---

## Tâches restantes (prochaines étapes)

- `[ ] 2.4` — Entités de fidélité et personnalisation (LoyaltyAccount, LoyaltyOffer, ProductCustomization)
- `[ ] 2.5` — Repositories Spring Data JPA pour toutes les entités
- `[ ] 3.x` — Configuration Spring Security + JWT
- `[ ] 4.x` — DTOs et validation
- `[ ] 5.x` — Gestion globale des exceptions
