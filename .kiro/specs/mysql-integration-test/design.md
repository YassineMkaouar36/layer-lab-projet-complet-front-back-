# Design Document — MySQL Integration Tests

## Overview

Ce design couvre les tests d'intégration MySQL pour trois entités : `User`, `Category`, `Product`.
L'objectif est de valider le mapping JPA, les opérations CRUD, les requêtes dérivées et une propriété round-trip sur `Category` via jqwik.

Les tests s'exécutent avec le profil Spring `mysql-test` qui pointe sur MySQL réel (`localhost:3306/layerlab_db`) avec `ddl-auto=create-drop`.

## Architecture

```
src/test/
├── resources/
│   └── application-mysql-test.properties   ← config MySQL pour les tests
└── java/com/layerlab/backend/
    ├── integration/
    │   ├── MySQLIntegrationTest.java         ← annotation composite (méta-annotation)
    │   ├── UserRepositoryMySQLTest.java
    │   ├── CategoryRepositoryMySQLTest.java
    │   └── ProductRepositoryMySQLTest.java
    └── security/
        └── JwtPropertyTest.java              ← existant
```

Le profil `mysql-test` surcharge `application.properties` (test) en remplaçant H2 par MySQL.
Chaque classe de test porte `@MySQLIntegrationTest` qui regroupe `@DataJpaTest`, `@ActiveProfiles("mysql-test")` et `@AutoConfigureTestDatabase(replace = NONE)`.

## Components and Interfaces

### `@MySQLIntegrationTest` (méta-annotation)

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@DataJpaTest
@ActiveProfiles("mysql-test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public @interface MySQLIntegrationTest {}
```

Avantages : évite la répétition sur chaque classe, centralise la configuration du profil.

### `UserRepositoryMySQLTest`

Couvre :
- `save()` → id généré, `createdAt` non null
- `findByEmail()` → présent / absent
- `existsByEmail()` → true / false

### `CategoryRepositoryMySQLTest`

Couvre :
- `save()` → id généré
- `findById()` après save → round-trip name (propriété PBT)
- Contrainte UNIQUE sur `name` → `DataIntegrityViolationException`

### `ProductRepositoryMySQLTest`

Couvre :
- `save()` avec `SubCategory` → clé étrangère persistée
- `findBySubCategoryId()` → filtre correct

## Data Models

Les entités utilisées sont celles existantes, sans modification :

| Entité      | Table          | Champs clés                                      |
|-------------|----------------|--------------------------------------------------|
| `User`      | `users`        | `email` (UNIQUE), `role`, `active`, `createdAt`  |
| `Category`  | `categories`   | `name` (UNIQUE)                                  |
| `SubCategory` | `subcategories` | `name`, `category_id` (FK)                    |
| `Product`   | `products`     | `name`, `price`, `stock`, `sub_category_id` (FK) |

Chaîne de dépendances pour `ProductRepositoryMySQLTest` :
`Category` → `SubCategory` → `Product`

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1 : Category name round-trip

*For any* non-blank string used as category name, saving a `Category` then reloading it by its generated id SHALL return an entity whose `name` is equal to the original string.

**Validates: Requirements 3.2**

### Property 2 : existsByEmail cohérence

*For any* user saved with a given email, `UserRepository.existsByEmail(email)` SHALL return `true`; and for any email that was never saved, it SHALL return `false`.

**Validates: Requirements 6.3**

### Property 3 : findBySubCategoryId filtre correct

*For any* set of products saved under a given subcategory, `ProductRepository.findBySubCategoryId(id)` SHALL return only products whose `subCategory.id` equals the queried id.

**Validates: Requirements 6.4**

**Réflexion sur la redondance :**
- Property 1 et Property 2 testent des entités différentes avec des patterns différents (round-trip vs existence) — pas de redondance.
- Property 3 teste un filtre de requête dérivée — distinct des deux autres.
- Les trois propriétés sont conservées.

## Error Handling

| Scénario | Comportement attendu |
|---|---|
| Deux `Category` avec le même `name` | `DataIntegrityViolationException` (contrainte UNIQUE MySQL) |
| MySQL inaccessible au démarrage | Échec du contexte Spring avec `DataSourceException` |
| `findByEmail` avec email inconnu | `Optional.empty()` (pas d'exception) |

## Testing Strategy

### Approche duale

- **Tests d'exemple** : cas concrets, valeurs par défaut, contraintes d'intégrité
- **Tests de propriété (jqwik)** : propriétés universelles sur les trois entités

### Configuration jqwik

- Minimum 100 itérations par propriété (`@Property(tries = 100)`)
- Tag de traçabilité : `Feature: mysql-integration-test, Property N: <texte>`

### Détail par classe

**`CategoryRepositoryMySQLTest`**
- Exemple : save → id non null
- Propriété PBT (Property 1) : round-trip name avec `@ForAll @AlphaChars @StringLength(min=1, max=50)`
- Edge case : UNIQUE violation → `DataIntegrityViolationException`

**`UserRepositoryMySQLTest`**
- Exemple : save → `createdAt` non null
- Exemple : `findByEmail` présent / absent
- Propriété PBT (Property 2) : `existsByEmail` cohérence avec `@ForAll @AlphaChars`

**`ProductRepositoryMySQLTest`**
- Exemple : save avec SubCategory → `subCategory` non null au rechargement
- Propriété PBT (Property 3) : `findBySubCategoryId` filtre correct

### Isolation

`@DataJpaTest` + `@Transactional` : chaque test est rollbacké automatiquement.
`ddl-auto=create-drop` : le schéma est recréé à chaque démarrage du contexte.

### Exécution

```bash
# Lancer uniquement les tests MySQL (nécessite MySQL local)
./mvnw test -Dspring.profiles.active=mysql-test -Dtest="*MySQLTest"
```
