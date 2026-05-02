# Document des Exigences — LayerLab Backend

## Introduction

LayerLab est une application de service d'impression 3D destinée au marché tunisien. Ce document définit les exigences fonctionnelles et non fonctionnelles du backend Spring Boot, qui expose une API REST consommée par le frontend React existant. Le backend couvre : l'authentification JWT, la gestion des produits/catégories, la gestion des fichiers 3D, la gestion des machines et filaments, la gestion des commandes, des paiements, la fidélisation client et les statistiques du tableau de bord administrateur.

---

## Glossaire

- **API** : Interface de Programmation d'Application REST exposée par le backend Spring Boot
- **JWT** : JSON Web Token utilisé pour l'authentification sans état
- **User** : Entité représentant un utilisateur du système (client ou administrateur)
- **Client** : Utilisateur avec le rôle ROLE_USER
- **Admin** : Utilisateur avec le rôle ROLE_ADMIN
- **Category** : Catégorie principale de produits (ex : LayerLab, AutoLab)
- **SubCategory** : Sous-catégorie appartenant à une Category
- **Product** : Article proposé à la vente, appartenant à une SubCategory
- **Review** : Avis et note (étoiles) laissé par un Client sur un Product
- **File** : Fichier 3D uploadé par un utilisateur
- **Machine** : Imprimante 3D gérée par le laboratoire
- **Filament** : Matière première utilisée par les machines
- **Order** : Commande passée par un Client
- **OrderItem** : Ligne d'une commande (produit + quantité + prix unitaire)
- **Payment** : Paiement associé à une Order
- **PromoCode** : Code de réduction applicable à une commande
- **LoyaltyProgram** : Programme de fidélité associé à un Client
- **AuthService** : Service gérant l'inscription et la connexion
- **ProductService** : Service gérant les produits et catégories
- **FileService** : Service gérant l'upload et la suppression de fichiers
- **MachineService** : Service gérant les machines
- **FilamentService** : Service gérant les filaments
- **OrderService** : Service gérant les commandes
- **PaymentService** : Service gérant les paiements
- **LoyaltyService** : Service gérant la fidélisation
- **DashboardService** : Service agrégeant les statistiques pour l'Admin
- **Validator** : Composant Hibernate Validator appliqué aux DTOs entrants
- **GlobalExceptionHandler** : Gestionnaire global des exceptions Spring

---

## Exigences

### Exigence 1 : Authentification et gestion des utilisateurs

**User Story :** En tant que visiteur, je veux m'inscrire et me connecter, afin d'accéder aux fonctionnalités de l'application selon mon rôle.

#### Critères d'acceptation

1. WHEN un visiteur soumet un email, un mot de passe, un nom, un prénom, un numéro de téléphone et une adresse valides à `POST /api/auth/register`, THE AuthService SHALL créer un compte User avec le rôle ROLE_USER et retourner un token JWT valide.
2. WHEN un visiteur soumet un email et un mot de passe valides à `POST /api/auth/login`, THE AuthService SHALL retourner un token JWT signé avec une durée de validité de 24 heures.
3. IF un visiteur soumet un email déjà enregistré à `POST /api/auth/register`, THEN THE AuthService SHALL retourner une réponse HTTP 409 avec un message d'erreur descriptif.
4. IF un visiteur soumet des identifiants incorrects à `POST /api/auth/login`, THEN THE AuthService SHALL retourner une réponse HTTP 401 avec un message d'erreur descriptif.
5. IF un visiteur soumet un champ obligatoire manquant ou invalide (email malformé, mot de passe < 8 caractères), THEN THE Validator SHALL retourner une réponse HTTP 400 avec la liste des erreurs de validation.
6. WHEN un Client ou un Admin inclut un token JWT valide dans l'en-tête `Authorization: Bearer <token>`, THE API SHALL autoriser l'accès aux endpoints protégés correspondant à son rôle.
7. IF un token JWT est absent, expiré ou invalide, THEN THE API SHALL retourner une réponse HTTP 401.
8. THE AuthService SHALL chiffrer les mots de passe avec BCrypt avant de les persister en base de données.

---

### Exigence 2 : Gestion des catégories et sous-catégories

**User Story :** En tant qu'Admin, je veux gérer les catégories et sous-catégories de produits, afin d'organiser le catalogue.

#### Critères d'acceptation

1. THE ProductService SHALL exposer un endpoint `GET /api/categories` retournant la liste de toutes les catégories avec leurs sous-catégories.
2. WHEN un Admin soumet un nom de catégorie valide à `POST /api/admin/categories`, THE ProductService SHALL créer la catégorie et retourner HTTP 201 avec la ressource créée.
3. WHEN un Admin soumet un nom de sous-catégorie et un identifiant de catégorie valides à `POST /api/admin/subcategories`, THE ProductService SHALL créer la sous-catégorie liée à la catégorie et retourner HTTP 201.
4. WHEN un Admin soumet une mise à jour valide à `PUT /api/admin/categories/{id}` ou `PUT /api/admin/subcategories/{id}`, THE ProductService SHALL mettre à jour la ressource et retourner HTTP 200.
5. WHEN un Admin envoie `DELETE /api/admin/categories/{id}`, THE ProductService SHALL supprimer la catégorie et retourner HTTP 204.
6. IF un Admin tente de supprimer une catégorie contenant des sous-catégories ou des produits actifs, THEN THE ProductService SHALL retourner HTTP 409 avec un message d'erreur descriptif.
7. IF un identifiant de catégorie ou de sous-catégorie n'existe pas, THEN THE GlobalExceptionHandler SHALL retourner HTTP 404 avec un message d'erreur descriptif.

---

### Exigence 3 : Gestion des produits

**User Story :** En tant qu'Admin, je veux gérer les produits du catalogue, afin de maintenir une offre à jour pour les clients.

#### Critères d'acceptation

1. THE ProductService SHALL exposer un endpoint `GET /api/products` retournant la liste paginée des produits avec nom, description, prix, auteur, sous-catégorie, stock et note moyenne.
2. THE ProductService SHALL exposer un endpoint `GET /api/products/{id}` retournant le détail d'un produit incluant ses avis.
3. WHEN un Admin soumet un nom, une description, un prix, un auteur, un identifiant de sous-catégorie et un stock valides à `POST /api/admin/products`, THE ProductService SHALL créer le produit et retourner HTTP 201.
4. WHEN un Admin soumet une mise à jour valide à `PUT /api/admin/products/{id}`, THE ProductService SHALL mettre à jour le produit et retourner HTTP 200.
5. WHEN un Admin envoie `DELETE /api/admin/products/{id}`, THE ProductService SHALL supprimer le produit et retourner HTTP 204.
6. WHILE le stock d'un Product est inférieur ou égal au seuil d'alerte configuré, THE ProductService SHALL inclure un indicateur `lowStock: true` dans la réponse du produit.
7. IF un identifiant de produit n'existe pas, THEN THE GlobalExceptionHandler SHALL retourner HTTP 404 avec un message d'erreur descriptif.
8. IF un prix soumis est négatif ou nul, THEN THE Validator SHALL retourner HTTP 400 avec un message d'erreur descriptif.

---

### Exigence 4 : Personnalisation des produits

**User Story :** En tant que Client, je veux personnaliser un produit avant de le commander, afin d'obtenir un objet adapté à mes besoins.

#### Critères d'acceptation

1. WHEN un Client soumet des options de personnalisation (couleur, texte, dimensions) valides à `POST /api/products/{id}/customize`, THE ProductService SHALL enregistrer les options et retourner un identifiant de configuration de personnalisation.
2. THE ProductService SHALL exposer un endpoint `GET /api/products/{id}/customizations/{configId}` permettant à un Client de récupérer sa configuration de personnalisation.
3. IF des options de personnalisation invalides ou incompatibles sont soumises, THEN THE Validator SHALL retourner HTTP 400 avec un message d'erreur descriptif.

---

### Exigence 5 : Gestion des avis clients

**User Story :** En tant que Client, je veux laisser un avis et une note sur un produit, afin d'aider les autres clients dans leur choix.

#### Critères d'acceptation

1. WHEN un Client authentifié soumet une note (entier entre 1 et 5) et un commentaire à `POST /api/products/{id}/reviews`, THE ProductService SHALL enregistrer l'avis et retourner HTTP 201.
2. THE ProductService SHALL exposer un endpoint `GET /api/products/{id}/reviews` retournant la liste des avis avec la note moyenne calculée.
3. IF un Client tente de soumettre plus d'un avis pour le même produit, THEN THE ProductService SHALL retourner HTTP 409 avec un message d'erreur descriptif.
4. IF la note soumise est hors de l'intervalle [1, 5], THEN THE Validator SHALL retourner HTTP 400 avec un message d'erreur descriptif.

---

### Exigence 6 : Gestion des fichiers 3D

**User Story :** En tant qu'utilisateur authentifié, je veux uploader et gérer mes fichiers 3D, afin de les utiliser pour des commandes personnalisées.

#### Critères d'acceptation

1. WHEN un utilisateur authentifié soumet un fichier valide (formats STL, OBJ, 3MF, taille ≤ 50 Mo) à `POST /api/files/upload`, THE FileService SHALL stocker le fichier, enregistrer les métadonnées (nom, chemin, taille, type, uploadedBy, date) et retourner HTTP 201 avec les métadonnées.
2. WHEN un utilisateur authentifié envoie `DELETE /api/files/{id}`, THE FileService SHALL supprimer le fichier et ses métadonnées et retourner HTTP 204.
3. THE FileService SHALL exposer un endpoint `GET /api/files/storage` retournant l'espace utilisé et l'espace disponible pour l'utilisateur courant.
4. THE FileService SHALL exposer un endpoint `GET /api/files` retournant la liste des fichiers de l'utilisateur courant.
5. IF un fichier soumis dépasse 50 Mo ou possède un format non supporté, THEN THE FileService SHALL retourner HTTP 400 avec un message d'erreur descriptif.
6. IF un utilisateur tente de supprimer un fichier qui ne lui appartient pas, THEN THE FileService SHALL retourner HTTP 403.

---

### Exigence 7 : Gestion des machines

**User Story :** En tant qu'Admin, je veux gérer l'état des imprimantes 3D, afin de suivre leur disponibilité et planifier la maintenance.

#### Critères d'acceptation

1. THE MachineService SHALL exposer un endpoint `GET /api/admin/machines` retournant la liste des machines avec leur nom, état (AVAILABLE, IN_USE, MAINTENANCE) et date de dernière maintenance.
2. WHEN un Admin soumet un nom valide à `POST /api/admin/machines`, THE MachineService SHALL créer la machine avec l'état AVAILABLE et retourner HTTP 201.
3. WHEN un Admin soumet un état valide à `PUT /api/admin/machines/{id}/status`, THE MachineService SHALL mettre à jour l'état de la machine et retourner HTTP 200.
4. THE MachineService SHALL exposer un endpoint `GET /api/admin/machines/available/count` retournant le nombre de machines avec l'état AVAILABLE.
5. WHILE une machine a une date de dernière maintenance supérieure à 30 jours, THE MachineService SHALL inclure un indicateur `maintenanceAlert: true` dans la réponse de la machine.
6. IF un identifiant de machine n'existe pas, THEN THE GlobalExceptionHandler SHALL retourner HTTP 404 avec un message d'erreur descriptif.
7. IF un état soumis ne correspond pas aux valeurs AVAILABLE, IN_USE ou MAINTENANCE, THEN THE Validator SHALL retourner HTTP 400 avec un message d'erreur descriptif.

---

### Exigence 8 : Gestion des filaments

**User Story :** En tant qu'Admin, je veux gérer les stocks de filaments, afin d'assurer la continuité de la production.

#### Critères d'acceptation

1. THE FilamentService SHALL exposer un endpoint `GET /api/admin/filaments` retournant la liste des filaments avec couleur, type, stock et disponibilité.
2. WHEN un Admin soumet une couleur, un type et un stock valides à `POST /api/admin/filaments`, THE FilamentService SHALL créer le filament et retourner HTTP 201.
3. WHEN un Admin soumet une mise à jour de stock valide à `PUT /api/admin/filaments/{id}`, THE FilamentService SHALL mettre à jour le filament et retourner HTTP 200.
4. WHILE le stock d'un Filament est inférieur ou égal au seuil d'alerte configuré (par défaut : 500 grammes), THE FilamentService SHALL inclure un indicateur `shortageAlert: true` dans la réponse du filament.
5. IF un identifiant de filament n'existe pas, THEN THE GlobalExceptionHandler SHALL retourner HTTP 404 avec un message d'erreur descriptif.

---

### Exigence 9 : Gestion des commandes

**User Story :** En tant que Client, je veux passer et suivre mes commandes, afin de recevoir les produits que j'ai commandés.

#### Critères d'acceptation

1. WHEN un Client authentifié soumet une liste d'OrderItems, un type (ONLINE ou PHONE), une option de livraison et une adresse de livraison (si livraison = true) valides à `POST /api/orders`, THE OrderService SHALL créer la commande avec l'état PREPARING et retourner HTTP 201 avec le détail de la commande.
2. THE OrderService SHALL exposer un endpoint `GET /api/orders/{id}` retournant le détail d'une commande incluant les OrderItems, l'état, le type, l'option de livraison et la date.
3. THE OrderService SHALL exposer un endpoint `GET /api/orders/my` retournant la liste paginée des commandes du Client authentifié.
4. WHEN un Admin soumet un état valide (PREPARING, READY, DELIVERING, DELIVERED) à `PUT /api/admin/orders/{id}/status`, THE OrderService SHALL mettre à jour l'état de la commande et retourner HTTP 200.
5. THE OrderService SHALL exposer un endpoint `GET /api/admin/orders` retournant la liste paginée de toutes les commandes avec filtres par état et par date.
6. WHEN une commande est créée, THE OrderService SHALL calculer le temps d'attente estimé en fonction du nombre de commandes en cours avec l'état PREPARING et retourner cette valeur dans la réponse.
7. WHEN un Admin soumet une priorité (entier entre 1 et 5) à `PUT /api/admin/orders/{id}/priority`, THE OrderService SHALL mettre à jour la priorité de la commande et retourner HTTP 200.
8. IF un produit commandé n'a pas un stock suffisant, THEN THE OrderService SHALL retourner HTTP 422 avec un message d'erreur descriptif indiquant le produit concerné.
9. IF un Client tente d'accéder à une commande qui ne lui appartient pas, THEN THE OrderService SHALL retourner HTTP 403.

---

### Exigence 10 : Gestion des paiements

**User Story :** En tant que Client, je veux payer ma commande et recevoir une facture, afin de finaliser mon achat.

#### Critères d'acceptation

1. WHEN un Client authentifié soumet un identifiant de commande et une méthode de paiement valide (CASH ou BANK_TRANSFER) à `POST /api/payments`, THE PaymentService SHALL créer le paiement avec le statut PENDING et retourner HTTP 201.
2. WHEN un Admin met à jour le statut d'un paiement à PAID via `PUT /api/admin/payments/{id}/status`, THE PaymentService SHALL mettre à jour le statut et retourner HTTP 200.
3. WHEN un paiement passe au statut PAID, THE PaymentService SHALL générer automatiquement une facture au format JSON contenant le numéro de commande, les articles, le montant total, la méthode de paiement et la date.
4. THE PaymentService SHALL exposer un endpoint `GET /api/payments/{orderId}` retournant le détail du paiement associé à une commande.
5. IF un code promo valide est soumis lors de la création du paiement, THEN THE PaymentService SHALL appliquer la remise correspondante au montant total avant de créer le paiement.
6. IF un identifiant de commande n'existe pas ou est déjà payé, THEN THE PaymentService SHALL retourner HTTP 422 avec un message d'erreur descriptif.

---

### Exigence 11 : Gestion des codes promo et remises

**User Story :** En tant qu'Admin, je veux créer des codes promo, afin d'offrir des remises aux clients.

#### Critères d'acceptation

1. WHEN un Admin soumet un code, un pourcentage de remise et une date de validité valides à `POST /api/admin/promo-codes`, THE PaymentService SHALL créer le code promo et retourner HTTP 201.
2. WHEN un Client soumet un code promo à `POST /api/promo-codes/validate`, THE PaymentService SHALL retourner le pourcentage de remise si le code est valide et non expiré.
3. IF un code promo est expiré ou inexistant, THEN THE PaymentService SHALL retourner HTTP 404 avec un message d'erreur descriptif.
4. IF un pourcentage de remise soumis est hors de l'intervalle [1, 100], THEN THE Validator SHALL retourner HTTP 400 avec un message d'erreur descriptif.

---

### Exigence 12 : Programme de fidélité

**User Story :** En tant que Client, je veux accumuler des points de fidélité, afin de bénéficier de récompenses.

#### Critères d'acceptation

1. WHEN un paiement passe au statut PAID, THE LoyaltyService SHALL créditer le compte de fidélité du Client avec un nombre de points proportionnel au montant payé (1 point par dinar tunisien).
2. THE LoyaltyService SHALL exposer un endpoint `GET /api/loyalty/my` retournant le solde de points et le niveau de fidélité du Client authentifié.
3. THE LoyaltyService SHALL définir trois niveaux de fidélité : BRONZE (0–499 points), SILVER (500–1999 points), GOLD (2000 points et plus).
4. WHEN un Admin envoie `POST /api/admin/loyalty/offers`, THE LoyaltyService SHALL enregistrer une offre personnalisée associée à un niveau de fidélité.
5. THE LoyaltyService SHALL exposer un endpoint `GET /api/loyalty/offers` retournant les offres disponibles pour le niveau de fidélité du Client authentifié.

---

### Exigence 13 : Tableau de bord administrateur (statistiques)

**User Story :** En tant qu'Admin, je veux consulter les statistiques de l'activité, afin de piloter le laboratoire.

#### Critères d'acceptation

1. THE DashboardService SHALL exposer un endpoint `GET /api/admin/dashboard/stats` retournant : le chiffre d'affaires du jour, le nombre d'utilisateurs actifs, le nombre de nouveaux clients du mois et le total des ventes.
2. THE DashboardService SHALL exposer un endpoint `GET /api/admin/dashboard/orders/overview` retournant la liste des dernières commandes avec leur état, pour alimenter la section "Orders Overview" du frontend.
3. THE DashboardService SHALL exposer un endpoint `GET /api/admin/dashboard/projects` retournant la liste des commandes en cours avec leur progression, pour alimenter la section "Projects" du frontend.
4. THE DashboardService SHALL exposer un endpoint `GET /api/admin/users` retournant la liste paginée des utilisateurs avec email, rôle, statut actif et date d'inscription, pour alimenter la page "Tables" du frontend.
5. WHEN un Admin interroge `GET /api/admin/dashboard/stats`, THE DashboardService SHALL retourner la réponse en moins de 2 secondes.

---

### Exigence 14 : Gestion globale des exceptions et validation

**User Story :** En tant que développeur frontend, je veux recevoir des réponses d'erreur structurées et cohérentes, afin de gérer les cas d'erreur de manière uniforme.

#### Critères d'acceptation

1. THE GlobalExceptionHandler SHALL intercepter toutes les exceptions non gérées et retourner une réponse JSON structurée contenant : le code HTTP, le message d'erreur, le timestamp et le chemin de la requête.
2. WHEN une exception de validation est levée, THE GlobalExceptionHandler SHALL retourner HTTP 400 avec la liste des champs invalides et leurs messages d'erreur respectifs.
3. THE GlobalExceptionHandler SHALL journaliser toutes les exceptions de niveau ERROR avec le stack trace complet.
4. IF une ressource demandée n'existe pas, THEN THE GlobalExceptionHandler SHALL retourner HTTP 404 avec un message d'erreur descriptif.
5. IF un accès non autorisé est tenté, THEN THE GlobalExceptionHandler SHALL retourner HTTP 403 avec un message d'erreur descriptif.

---

### Exigence 15 : Documentation API et configuration technique

**User Story :** En tant que développeur frontend, je veux accéder à une documentation API interactive, afin d'intégrer le backend facilement.

#### Critères d'acceptation

1. THE API SHALL exposer une interface Swagger UI accessible à `/swagger-ui.html` documentant tous les endpoints avec leurs paramètres, corps de requête et réponses possibles.
2. THE API SHALL configurer CORS pour autoriser les requêtes provenant de l'origine du frontend React (`http://localhost:5173` en développement).
3. THE API SHALL retourner toutes les réponses au format JSON avec l'en-tête `Content-Type: application/json`.
4. WHILE l'application est en cours d'exécution, THE API SHALL répondre à `GET /actuator/health` avec le statut de santé de l'application.

---

### Exigence 16 : Exigences non fonctionnelles

**User Story :** En tant qu'opérateur du laboratoire, je veux un backend performant, sécurisé et disponible, afin de garantir la continuité du service.

#### Critères d'acceptation

1. WHEN une requête est reçue par l'API, THE API SHALL retourner une réponse en moins de 2 secondes pour 95 % des requêtes sous une charge de 500 requêtes simultanées.
2. THE API SHALL chiffrer toutes les communications via HTTPS en environnement de production.
3. THE API SHALL journaliser chaque action d'écriture (création, modification, suppression) avec l'identifiant de l'utilisateur, le timestamp et la ressource concernée.
4. WHERE la fonctionnalité d'authentification à deux facteurs est activée, THE AuthService SHALL envoyer un code OTP par email et exiger sa validation avant d'émettre le token JWT.
5. THE API SHALL effectuer une sauvegarde automatique de la base de données MySQL toutes les 24 heures.
6. THE API SHALL être conforme au RGPD en permettant à un Client de demander la suppression de ses données personnelles via `DELETE /api/users/me`.
