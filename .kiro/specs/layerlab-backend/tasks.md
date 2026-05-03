# Plan d'Implémentation : LayerLab Backend

## Vue d'ensemble

Ce plan détaille l'implémentation du backend LayerLab avec Spring Boot 3.x, MySQL, Spring Security + JWT, et Swagger. L'architecture suit une séparation stricte en couches (Controller / Service / Repository / Entity) avec gestion centralisée des erreurs et tests de propriétés pour garantir la correction.

## Tâches

- [x] 1. Configuration initiale du projet Spring Boot
  - Créer le fichier `pom.xml` avec les dépendances : Spring Boot 3.x, Spring Web, Spring Data JPA, Spring Security, MySQL Connector, jjwt (JWT), SpringDoc OpenAPI, Hibernate Validator, Lombok, jqwik (tests PBT)
  - Créer le fichier `application.properties` avec la configuration MySQL, JWT secret, CORS, et paramètres JPA
  - Créer la structure de packages : config, controller, service, repository, entity, dto (request/response), security, exception
  - _Exigences : 15.1, 15.2, 15.3_

- [ ] 2. Création des entités JPA et repositories
  - [x] 2.1 Créer les entités de base
    - Créer `User.java` avec les champs : id, firstName, lastName, email (unique), password, phone, address, role (enum), active, createdAt
    - Créer `Category.java` avec les champs : id, name (unique)
    - Créer `SubCategory.java` avec les champs : id, name, categoryId (ManyToOne)
    - Créer `Product.java` avec les champs : id, name, description, price, author, subCategoryId (ManyToOne), stock, stockAlertThreshold, averageRating
    - Créer `Review.java` avec les champs : id, productId (ManyToOne), userId (ManyToOne), rating, comment, createdAt
    - _Exigences : 1.1, 2.1, 3.1, 5.1_
  
  - [x] 2.2 Créer les entités de fichiers et ressources
    - Créer `FileEntity.java` avec les champs : id, originalName, storagePath, size, fileType, uploadedById (ManyToOne), uploadedAt
    - Créer `Machine.java` avec les champs : id, name, status (enum), lastMaintenanceDate
    - Créer `Filament.java` avec les champs : id, color, type, stockGrams, available, alertThreshold
    - _Exigences : 6.1, 7.1, 8.1_
  
  - [x] 2.3 Créer les entités de commandes et paiements
    - Créer `Order.java` avec les champs : id, userId (ManyToOne), status (enum), type (enum), delivery, deliveryAddress, priority, estimatedWaitTime, createdAt
    - Créer `OrderItem.java` avec les champs : id, orderId (ManyToOne), productId (ManyToOne), quantity, unitPrice
    - Créer `Payment.java` avec les champs : id, orderId (OneToOne), amount, method (enum), status (enum), createdAt
    - Créer `PromoCode.java` avec les champs : id, code (unique), discountPercent, validUntil, active
    - _Exigences : 9.1, 10.1, 11.1_
  
  - [x] 2.4 Créer les entités de fidélité et personnalisation
    - Créer `LoyaltyAccount.java` avec les champs : id, userId (OneToOne), points, level (calculé dynamiquement)
    - Créer `LoyaltyOffer.java` avec les champs : id, level, description, discountPercent
    - Créer `ProductCustomization.java` avec les champs : id, productId (ManyToOne), userId (ManyToOne), color, text, dimensions
    - _Exigences : 12.1, 12.3, 4.1_
  
  - [x] 2.5 Créer les repositories Spring Data JPA
    - Créer les interfaces JpaRepository pour toutes les entités : UserRepository, CategoryRepository, SubCategoryRepository, ProductRepository, ReviewRepository, FileEntityRepository, MachineRepository, FilamentRepository, OrderRepository, OrderItemRepository, PaymentRepository, PromoCodeRepository, LoyaltyAccountRepository, LoyaltyOfferRepository, ProductCustomizationRepository
    - Ajouter les méthodes de requête personnalisées nécessaires (findByEmail, findByCode, findByUserId, etc.)
    - _Exigences : 1.1, 2.1, 3.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1_


- [x] 3. Configuration de la sécurité Spring Security + JWT
  - [x] 3.1 Créer les composants JWT
    - Créer `JwtUtil.java` avec les méthodes : generateToken(email), validateToken(token), extractUsername(token), isTokenExpired(token)
    - Configurer l'algorithme HS256, expiration 24h, secret depuis application.properties
    - _Exigences : 1.2, 1.6_
  
  - [x] 3.2 Écrire le test de propriété pour la validité JWT
    - **Propriété 2 : Validité et expiration du token JWT**
    - **Valide : Exigence 1.2**
    - Créer `JwtPropertyTest.java` avec jqwik
    - Générer des emails arbitraires et vérifier que le token est valide immédiatement et invalide après 24h
  
  - [x] 3.3 Créer le filtre d'authentification JWT
    - Créer `JwtAuthenticationFilter.java` extends OncePerRequestFilter
    - Extraire le token de l'en-tête Authorization, valider et injecter l'authentification dans SecurityContext
    - _Exigences : 1.6, 1.7_
  
  - [x] 3.4 Créer UserDetailsServiceImpl
    - Implémenter UserDetailsService
    - Charger l'utilisateur depuis UserRepository par email
    - Mapper les rôles vers GrantedAuthority
    - _Exigences : 1.6_
  
  - [x] 3.5 Créer SecurityConfig
    - Configurer HttpSecurity : désactiver CSRF, autoriser /api/auth/**, /swagger-ui/**, /v3/api-docs/**
    - Protéger /api/admin/** avec ROLE_ADMIN
    - Protéger /api/** avec authentification
    - Ajouter JwtAuthenticationFilter avant UsernamePasswordAuthenticationFilter
    - Configurer BCryptPasswordEncoder
    - _Exigences : 1.6, 1.7, 1.8_
  
  - [x] 3.6 Écrire le test de propriété pour le chiffrement BCrypt
    - **Propriété 1 : Chiffrement des mots de passe**
    - **Valide : Exigence 1.8**
    - Créer `PasswordEncodingPropertyTest.java` avec jqwik
    - Générer des mots de passe arbitraires (≥ 8 caractères) et vérifier que le hash BCrypt est différent du mot de passe en clair et vérifiable via matches()

- [x] 4. Création des DTOs et validation
  - [x] 4.1 Créer les DTOs de requête
    - Créer `RegisterRequest.java` avec validation : email (format email), password (min 8 caractères), firstName, lastName, phone, address
    - Créer `LoginRequest.java` avec validation : email, password
    - Créer `ProductRequest.java` avec validation : name, description, price (> 0), author, subCategoryId, stock
    - Créer `ReviewRequest.java` avec validation : rating (min 1, max 5), comment
    - Créer `OrderRequest.java` avec validation : items (non vide), type, delivery, deliveryAddress (si delivery = true)
    - Créer `PaymentRequest.java` avec validation : orderId, method, promoCode (optionnel)
    - Créer les autres DTOs de requête nécessaires (CategoryRequest, MachineRequest, FilamentRequest, PromoCodeRequest, etc.)
    - _Exigences : 1.5, 3.8, 5.4, 11.4_
  
  - [x] 4.2 Créer les DTOs de réponse
    - Créer `AuthResponse.java` avec : token, email, role
    - Créer `ProductResponse.java` avec : id, name, description, price, author, subCategory, stock, averageRating, lowStock
    - Créer `OrderResponse.java` avec : id, items, status, type, delivery, deliveryAddress, priority, estimatedWaitTime, createdAt
    - Créer `PaymentResponse.java` avec : id, orderId, amount, method, status, createdAt
    - Créer `LoyaltyAccountResponse.java` avec : points, level
    - Créer les autres DTOs de réponse nécessaires
    - _Exigences : 1.2, 3.1, 9.1, 10.1, 12.2_
  
  - [x] 4.3 Écrire le test de propriété pour la validation des entrées
    - **Propriété 3 : Rejet des tâches invalides**
    - **Valide : Exigences 1.5, 3.8, 5.4, 11.4**
    - Créer `ValidationPropertyTest.java` avec jqwik
    - Générer des valeurs hors contraintes (email malformé, password < 8, rating hors [1,5], prix ≤ 0, remise hors [1,100]) et vérifier que le système retourne HTTP 400

- [x] 5. Gestion globale des exceptions
  - [x] 5.1 Créer les exceptions personnalisées
    - Créer `ResourceNotFoundException.java` extends RuntimeException
    - Créer `ConflictException.java` extends RuntimeException
    - Créer `ForbiddenException.java` extends RuntimeException
    - Créer `UnprocessableEntityException.java` extends RuntimeException
    - _Exigences : 14.1, 14.4, 14.5_
  
  - [x] 5.2 Créer GlobalExceptionHandler
    - Annoter avec @ControllerAdvice
    - Intercepter ResourceNotFoundException → HTTP 404
    - Intercepter ConflictException → HTTP 409
    - Intercepter ForbiddenException → HTTP 403
    - Intercepter UnprocessableEntityException → HTTP 422
    - Intercepter MethodArgumentNotValidException → HTTP 400 avec liste des erreurs
    - Intercepter Exception (catch-all) → HTTP 500
    - Format de réponse uniforme : status, message, timestamp, path
    - _Exigences : 14.1, 14.2, 14.3_
  
  - [x] 5.3 Écrire le test de propriété pour la structure des erreurs
    - **Propriété 11 : Structure uniforme des réponses d'erreur**
    - **Valide : Exigence 14.1**
    - Créer `ErrorResponsePropertyTest.java` avec jqwik
    - Générer différents types d'exceptions et vérifier que la réponse contient exactement status, message, timestamp, path

- [x] 6. Checkpoint - Vérifier la configuration de base
  - Vérifier que l'application démarre sans erreur
  - Vérifier que Swagger UI est accessible à /swagger-ui.html
  - Vérifier que /actuator/health retourne UP
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.


- [x] 7. Authentification à deux facteurs (2FA / Double Authentification)
  - [x] 7.1 Mettre à jour l'entité User pour la 2FA
    - Ajouter les champs : `twoFactorEnabled` (Boolean, défaut false), `twoFactorSecret` (String, nullable), `otpCode` (String, nullable), `otpExpiry` (LocalDateTime, nullable)
    - Créer la migration / mise à jour du schéma JPA
    - _Exigences : 16.4_

  - [x] 7.2 Créer TwoFactorService et TwoFactorServiceImpl
    - Implémenter `generateOtp(userId)` : générer un code OTP à 6 chiffres, le stocker hashé avec une expiration de 10 minutes, envoyer par email via JavaMailSender
    - Implémenter `validateOtp(userId, code)` : vérifier le code OTP (non expiré, correspondance), invalider le code après usage
    - Implémenter `enableTwoFactor(userId)` : activer la 2FA pour l'utilisateur
    - Implémenter `disableTwoFactor(userId)` : désactiver la 2FA pour l'utilisateur
    - Lever `UnprocessableEntityException` si le code OTP est invalide ou expiré
    - _Exigences : 16.4_

  - [x] 7.3 Créer TwoFactorController
    - Exposer POST /api/auth/2fa/enable → activer la 2FA pour l'utilisateur authentifié
    - Exposer POST /api/auth/2fa/disable → désactiver la 2FA pour l'utilisateur authentifié
    - Exposer POST /api/auth/2fa/verify → valider le code OTP et émettre le token JWT final
    - _Exigences : 16.4_

  - [x] 7.4 Créer les DTOs pour la 2FA
    - Créer `TwoFactorVerifyRequest.java` avec validation : userId (non null), otpCode (6 chiffres)
    - Créer `TwoFactorResponse.java` avec : requiresTwoFactor (boolean), userId (si 2FA requise), token (si 2FA non requise ou validée)
    - _Exigences : 16.4_

  - [x] 7.5 Configurer JavaMailSender
    - Ajouter les dépendances Spring Boot Mail dans pom.xml
    - Configurer les propriétés SMTP dans application.properties (host, port, username, password, TLS)
    - Créer `EmailService.java` avec méthode `sendOtpEmail(to, otpCode)`
    - _Exigences : 16.4_

  - [x] 7.6 Écrire le test de propriété pour la validité OTP
    - **Propriété 12 : Validité et expiration du code OTP**
    - **Valide : Exigence 16.4**
    - Créer `OtpPropertyTest.java` avec jqwik
    - Vérifier que le code OTP est valide immédiatement après génération et invalide après 10 minutes
    - Vérifier qu'un code OTP ne peut être utilisé qu'une seule fois (invalidation après usage)

- [x] 8. Implémentation du service d'authentification
  - [x] 8.1 Créer AuthService et AuthServiceImpl
    - Implémenter register(RegisterRequest) : vérifier unicité email, chiffrer mot de passe avec BCrypt, créer User avec ROLE_USER, générer token JWT
    - Implémenter login(LoginRequest) : vérifier identifiants ; si 2FA activée → générer OTP, retourner `requiresTwoFactor: true` avec userId ; sinon → générer token JWT directement
    - Lever ConflictException si email déjà utilisé
    - Lever AuthenticationException si identifiants incorrects
    - _Exigences : 1.1, 1.2, 1.3, 1.4, 1.8, 16.4_
  
  - [x] 8.2 Créer AuthController
    - Exposer POST /api/auth/register → appeler AuthService.register()
    - Exposer POST /api/auth/login → appeler AuthService.login() (retourne token ou challenge 2FA)
    - Retourner TwoFactorResponse (token direct si 2FA désactivée, ou requiresTwoFactor + userId si 2FA activée)
    - _Exigences : 1.1, 1.2, 16.4_
  
  - [x] 8.3 Écrire les tests unitaires pour AuthService
    - Tester le cas nominal d'inscription et de connexion sans 2FA
    - Tester le cas de connexion avec 2FA activée (retourne challenge)
    - Tester le cas de validation OTP correcte (retourne token JWT)
    - Tester le cas d'OTP invalide ou expiré (HTTP 422)
    - Tester le cas d'email déjà utilisé (HTTP 409)
    - Tester le cas d'identifiants incorrects (HTTP 401)
    - Tester la validation des champs (HTTP 400)

- [ ] 9. Implémentation de la gestion des catégories et sous-catégories
  - [ ] 9.1 Créer CategoryService et CategoryServiceImpl
    - Implémenter getAllCategories() : retourner toutes les catégories avec leurs sous-catégories
    - Implémenter createCategory(CategoryRequest) : créer une catégorie
    - Implémenter updateCategory(id, CategoryRequest) : mettre à jour une catégorie
    - Implémenter deleteCategory(id) : vérifier absence de sous-catégories/produits actifs, sinon lever ConflictException
    - Implémenter createSubCategory(SubCategoryRequest) : créer une sous-catégorie liée à une catégorie
    - Implémenter updateSubCategory(id, SubCategoryRequest) : mettre à jour une sous-catégorie
    - Lever ResourceNotFoundException si id inexistant
    - _Exigences : 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ] 9.2 Créer CategoryController
    - Exposer GET /api/categories → appeler CategoryService.getAllCategories()
    - Exposer POST /api/admin/categories → appeler CategoryService.createCategory()
    - Exposer PUT /api/admin/categories/{id} → appeler CategoryService.updateCategory()
    - Exposer DELETE /api/admin/categories/{id} → appeler CategoryService.deleteCategory()
    - Exposer POST /api/admin/subcategories → appeler CategoryService.createSubCategory()
    - Exposer PUT /api/admin/subcategories/{id} → appeler CategoryService.updateSubCategory()
    - _Exigences : 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 9.3 Écrire les tests unitaires pour CategoryService
    - Tester la création, mise à jour et suppression de catégories
    - Tester le cas de suppression avec sous-catégories actives (HTTP 409)
    - Tester le cas d'id inexistant (HTTP 404)

- [ ] 10. Implémentation de la gestion des produits
  - [ ] 10.1 Créer ProductService et ProductServiceImpl
    - Implémenter getAllProducts(Pageable) : retourner la liste paginée des produits avec indicateur lowStock si stock ≤ seuil
    - Implémenter getProductById(id) : retourner le détail d'un produit avec ses avis
    - Implémenter createProduct(ProductRequest) : créer un produit
    - Implémenter updateProduct(id, ProductRequest) : mettre à jour un produit
    - Implémenter deleteProduct(id) : supprimer un produit
    - Lever ResourceNotFoundException si id inexistant
    - _Exigences : 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [ ] 10.2 Créer ProductController
    - Exposer GET /api/products → appeler ProductService.getAllProducts()
    - Exposer GET /api/products/{id} → appeler ProductService.getProductById()
    - Exposer POST /api/admin/products → appeler ProductService.createProduct()
    - Exposer PUT /api/admin/products/{id} → appeler ProductService.updateProduct()
    - Exposer DELETE /api/admin/products/{id} → appeler ProductService.deleteProduct()
    - _Exigences : 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 10.3 Écrire les tests unitaires pour ProductService
    - Tester la création, mise à jour et suppression de produits
    - Tester le calcul de l'indicateur lowStock
    - Tester le cas d'id inexistant (HTTP 404)
    - Tester le cas de prix invalide (HTTP 400)

- [ ] 11. Implémentation de la gestion des avis clients
  - [ ] 11.1 Créer ReviewService et ReviewServiceImpl
    - Implémenter createReview(productId, ReviewRequest, userId) : vérifier unicité (client, produit), créer l'avis, recalculer averageRating du produit
    - Implémenter getReviewsByProduct(productId) : retourner la liste des avis avec la note moyenne
    - Lever ConflictException si avis en double
    - Lever ResourceNotFoundException si produit inexistant
    - _Exigences : 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 11.2 Créer ReviewController
    - Exposer POST /api/products/{id}/reviews → appeler ReviewService.createReview()
    - Exposer GET /api/products/{id}/reviews → appeler ReviewService.getReviewsByProduct()
    - _Exigences : 5.1, 5.2_
  
  - [ ]* 11.3 Écrire le test de propriété pour l'unicité des avis
    - **Propriété 8 : Unicité des avis par produit**
    - **Valide : Exigence 5.3**
    - Créer `ReviewUniquenessPropertyTest.java` avec jqwik
    - Générer des paires (client, produit) et vérifier qu'un second avis retourne HTTP 409
  
  - [ ]* 11.4 Écrire le test de propriété pour la note moyenne
    - **Propriété 9 : Cohérence de la note moyenne**
    - **Valide : Exigence 5.2**
    - Créer `AverageRatingPropertyTest.java` avec jqwik
    - Générer des listes de notes [1,5] et vérifier que averageRating = somme / nombre, arrondi à 2 décimales

- [ ] 12. Implémentation de la personnalisation des produits
  - [ ] 12.1 Créer ProductCustomizationService et ProductCustomizationServiceImpl
    - Implémenter createCustomization(productId, customizationRequest, userId) : enregistrer les options de personnalisation
    - Implémenter getCustomization(productId, configId, userId) : retourner la configuration
    - Lever ResourceNotFoundException si produit ou configuration inexistant
    - _Exigences : 4.1, 4.2, 4.3_
  
  - [ ] 12.2 Créer ProductCustomizationController
    - Exposer POST /api/products/{id}/customize → appeler ProductCustomizationService.createCustomization()
    - Exposer GET /api/products/{id}/customizations/{configId} → appeler ProductCustomizationService.getCustomization()
    - _Exigences : 4.1, 4.2_
  
  - [ ]* 12.3 Écrire les tests unitaires pour ProductCustomizationService
    - Tester la création et récupération de configurations
    - Tester le cas d'options invalides (HTTP 400)

- [ ] 13. Checkpoint - Vérifier les fonctionnalités de base
  - Vérifier que l'inscription, la connexion et la gestion des produits fonctionnent
  - Vérifier que les avis et la personnalisation fonctionnent
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.


- [ ] 14. Implémentation de la gestion des fichiers 3D
  - [ ] 14.1 Créer FileService et FileServiceImpl
    - Implémenter uploadFile(MultipartFile, userId) : vérifier format (STL, OBJ, 3MF) et taille (≤ 50 Mo), stocker le fichier, enregistrer les métadonnées
    - Implémenter deleteFile(id, userId) : vérifier propriété du fichier, supprimer le fichier et les métadonnées
    - Implémenter getStorageInfo(userId) : calculer l'espace utilisé et disponible
    - Implémenter getUserFiles(userId) : retourner la liste des fichiers de l'utilisateur
    - Lever ForbiddenException si l'utilisateur tente de supprimer un fichier qui ne lui appartient pas
    - _Exigences : 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ] 14.2 Créer FileController
    - Exposer POST /api/files/upload → appeler FileService.uploadFile()
    - Exposer DELETE /api/files/{id} → appeler FileService.deleteFile()
    - Exposer GET /api/files/storage → appeler FileService.getStorageInfo()
    - Exposer GET /api/files → appeler FileService.getUserFiles()
    - _Exigences : 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 14.3 Écrire le test de propriété pour l'isolation des ressources
    - **Propriété 7 : Isolation des ressources utilisateur**
    - **Valide : Exigences 6.6, 9.9**
    - Créer `ResourceIsolationPropertyTest.java` avec jqwik
    - Générer des paires d'utilisateurs distincts et vérifier qu'un utilisateur ne peut pas accéder aux ressources d'un autre (HTTP 403)
  
  - [ ]* 14.4 Écrire les tests unitaires pour FileService
    - Tester l'upload et la suppression de fichiers
    - Tester le cas de fichier trop volumineux ou format invalide (HTTP 400)
    - Tester le cas d'accès non autorisé (HTTP 403)

- [ ] 15. Implémentation de la gestion des machines
  - [ ] 15.1 Créer MachineService et MachineServiceImpl
    - Implémenter getAllMachines() : retourner la liste des machines avec indicateur maintenanceAlert si lastMaintenanceDate > 30 jours
    - Implémenter createMachine(MachineRequest) : créer une machine avec état AVAILABLE
    - Implémenter updateMachineStatus(id, status) : mettre à jour l'état de la machine
    - Implémenter getAvailableMachinesCount() : retourner le nombre de machines AVAILABLE
    - Lever ResourceNotFoundException si id inexistant
    - _Exigences : 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [ ] 15.2 Créer MachineController
    - Exposer GET /api/admin/machines → appeler MachineService.getAllMachines()
    - Exposer POST /api/admin/machines → appeler MachineService.createMachine()
    - Exposer PUT /api/admin/machines/{id}/status → appeler MachineService.updateMachineStatus()
    - Exposer GET /api/admin/machines/available/count → appeler MachineService.getAvailableMachinesCount()
    - _Exigences : 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 15.3 Écrire les tests unitaires pour MachineService
    - Tester la création et mise à jour de machines
    - Tester le calcul de l'indicateur maintenanceAlert
    - Tester le cas d'id inexistant (HTTP 404)
    - Tester le cas d'état invalide (HTTP 400)

- [ ] 16. Implémentation de la gestion des filaments
  - [ ] 16.1 Créer FilamentService et FilamentServiceImpl
    - Implémenter getAllFilaments() : retourner la liste des filaments avec indicateur shortageAlert si stock ≤ seuil (500g par défaut)
    - Implémenter createFilament(FilamentRequest) : créer un filament
    - Implémenter updateFilament(id, FilamentRequest) : mettre à jour le stock du filament
    - Lever ResourceNotFoundException si id inexistant
    - _Exigences : 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 16.2 Créer FilamentController
    - Exposer GET /api/admin/filaments → appeler FilamentService.getAllFilaments()
    - Exposer POST /api/admin/filaments → appeler FilamentService.createFilament()
    - Exposer PUT /api/admin/filaments/{id} → appeler FilamentService.updateFilament()
    - _Exigences : 8.1, 8.2, 8.3_
  
  - [ ]* 16.3 Écrire les tests unitaires pour FilamentService
    - Tester la création et mise à jour de filaments
    - Tester le calcul de l'indicateur shortageAlert
    - Tester le cas d'id inexistant (HTTP 404)

- [ ] 17. Implémentation de la gestion des commandes
  - [ ] 17.1 Créer OrderService et OrderServiceImpl
    - Implémenter createOrder(OrderRequest, userId) : vérifier stock des produits, créer la commande avec état PREPARING, décrémenter le stock, calculer estimatedWaitTime
    - Implémenter getOrderById(id, userId) : retourner le détail d'une commande avec vérification de propriété
    - Implémenter getMyOrders(userId, Pageable) : retourner la liste paginée des commandes du client
    - Implémenter updateOrderStatus(id, status) : mettre à jour l'état de la commande
    - Implémenter getAllOrders(Pageable, filters) : retourner la liste paginée de toutes les commandes avec filtres
    - Implémenter updateOrderPriority(id, priority) : mettre à jour la priorité de la commande
    - Lever UnprocessableEntityException si stock insuffisant
    - Lever ForbiddenException si l'utilisateur tente d'accéder à une commande qui ne lui appartient pas
    - _Exigences : 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_
  
  - [ ] 17.2 Créer OrderController
    - Exposer POST /api/orders → appeler OrderService.createOrder()
    - Exposer GET /api/orders/{id} → appeler OrderService.getOrderById()
    - Exposer GET /api/orders/my → appeler OrderService.getMyOrders()
    - Exposer PUT /api/admin/orders/{id}/status → appeler OrderService.updateOrderStatus()
    - Exposer GET /api/admin/orders → appeler OrderService.getAllOrders()
    - Exposer PUT /api/admin/orders/{id}/priority → appeler OrderService.updateOrderPriority()
    - _Exigences : 9.1, 9.2, 9.3, 9.4, 9.5, 9.7_
  
  - [ ]* 17.3 Écrire le test de propriété pour l'invariant de stock
    - **Propriété 4 : Invariant de stock lors de la création de commande**
    - **Valide : Exigence 9.8**
    - Créer `OrderStockPropertyTest.java` avec jqwik
    - Générer des quantités et stocks aléatoires et vérifier que le stock est décrémenté exactement de la quantité commandée, et qu'aucune commande n'est créée si stock insuffisant
  
  - [ ]* 17.4 Écrire les tests unitaires pour OrderService
    - Tester la création et mise à jour de commandes
    - Tester le calcul de estimatedWaitTime
    - Tester le cas de stock insuffisant (HTTP 422)
    - Tester le cas d'accès non autorisé (HTTP 403)

- [ ] 18. Checkpoint - Vérifier les fonctionnalités de fichiers, machines et commandes
  - Vérifier que l'upload de fichiers, la gestion des machines et des filaments fonctionnent
  - Vérifier que la création et le suivi des commandes fonctionnent
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.


- [ ] 19. Implémentation de la gestion des paiements
  - [ ] 19.1 Créer PaymentService et PaymentServiceImpl
    - Implémenter createPayment(PaymentRequest, userId) : vérifier que la commande existe et n'est pas déjà payée, appliquer le code promo si valide, créer le paiement avec statut PENDING
    - Implémenter updatePaymentStatus(id, status) : mettre à jour le statut du paiement, si PAID → générer facture JSON et créditer points de fidélité
    - Implémenter getPaymentByOrderId(orderId) : retourner le détail du paiement
    - Lever UnprocessableEntityException si commande déjà payée ou inexistante
    - _Exigences : 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ] 19.2 Créer PaymentController
    - Exposer POST /api/payments → appeler PaymentService.createPayment()
    - Exposer PUT /api/admin/payments/{id}/status → appeler PaymentService.updatePaymentStatus()
    - Exposer GET /api/payments/{orderId} → appeler PaymentService.getPaymentByOrderId()
    - _Exigences : 10.1, 10.2, 10.4_
  
  - [ ]* 19.3 Écrire les tests unitaires pour PaymentService
    - Tester la création et mise à jour de paiements
    - Tester l'application de codes promo
    - Tester la génération de facture
    - Tester le cas de commande déjà payée (HTTP 422)

- [ ] 20. Implémentation de la gestion des codes promo
  - [ ] 20.1 Créer PromoCodeService et PromoCodeServiceImpl
    - Implémenter createPromoCode(PromoCodeRequest) : créer un code promo
    - Implémenter validatePromoCode(code) : vérifier que le code existe, est actif et non expiré, retourner le pourcentage de remise
    - Lever ResourceNotFoundException si code inexistant ou expiré
    - _Exigences : 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 20.2 Créer PromoCodeController
    - Exposer POST /api/admin/promo-codes → appeler PromoCodeService.createPromoCode()
    - Exposer POST /api/promo-codes/validate → appeler PromoCodeService.validatePromoCode()
    - _Exigences : 11.1, 11.2_
  
  - [ ]* 20.3 Écrire le test de propriété pour la validité des codes promo
    - **Propriété 10 : Validité des codes promo**
    - **Valide : Exigences 11.2, 11.3**
    - Créer `PromoCodePropertyTest.java` avec jqwik
    - Générer des codes, dates et pourcentages et vérifier que le système retourne le pourcentage si et seulement si le code existe, est actif et non expiré
  
  - [ ]* 20.4 Écrire les tests unitaires pour PromoCodeService
    - Tester la création et validation de codes promo
    - Tester le cas de code expiré ou inexistant (HTTP 404)
    - Tester le cas de pourcentage invalide (HTTP 400)

- [ ] 21. Implémentation du programme de fidélité
  - [ ] 21.1 Créer LoyaltyService et LoyaltyServiceImpl
    - Implémenter creditPoints(userId, amount) : créditer le compte de fidélité avec floor(amount) points
    - Implémenter getMyLoyaltyAccount(userId) : retourner le solde de points et le niveau calculé dynamiquement (BRONZE [0-499], SILVER [500-1999], GOLD [≥2000])
    - Implémenter createLoyaltyOffer(LoyaltyOfferRequest) : créer une offre associée à un niveau
    - Implémenter getOffersForUser(userId) : retourner les offres disponibles pour le niveau de l'utilisateur
    - _Exigences : 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 21.2 Créer LoyaltyController
    - Exposer GET /api/loyalty/my → appeler LoyaltyService.getMyLoyaltyAccount()
    - Exposer POST /api/admin/loyalty/offers → appeler LoyaltyService.createLoyaltyOffer()
    - Exposer GET /api/loyalty/offers → appeler LoyaltyService.getOffersForUser()
    - _Exigences : 12.2, 12.4, 12.5_
  
  - [ ]* 21.3 Écrire le test de propriété pour le calcul des points de fidélité
    - **Propriété 5 : Calcul des points de fidélité**
    - **Valide : Exigence 12.1**
    - Créer `LoyaltyPointsPropertyTest.java` avec jqwik
    - Générer des montants BigDecimal positifs et vérifier que le compte est crédité d'exactement floor(montant) points
  
  - [ ]* 21.4 Écrire le test de propriété pour la cohérence du niveau de fidélité
    - **Propriété 6 : Cohérence du niveau de fidélité**
    - **Valide : Exigence 12.3**
    - Créer `LoyaltyLevelPropertyTest.java` avec jqwik
    - Générer des soldes de points [0, 5000] et vérifier que le niveau est BRONZE [0-499], SILVER [500-1999], GOLD [≥2000]
  
  - [ ]* 21.5 Écrire les tests unitaires pour LoyaltyService
    - Tester le crédit de points et le calcul du niveau
    - Tester la création et récupération d'offres

- [ ] 22. Implémentation du tableau de bord administrateur
  - [ ] 22.1 Créer DashboardService et DashboardServiceImpl
    - Implémenter getStats() : calculer le chiffre d'affaires du jour, le nombre d'utilisateurs actifs, le nombre de nouveaux clients du mois et le total des ventes
    - Implémenter getOrdersOverview() : retourner la liste des dernières commandes avec leur état
    - Implémenter getProjects() : retourner la liste des commandes en cours avec leur progression
    - Implémenter getAllUsers(Pageable) : retourner la liste paginée des utilisateurs
    - Optimiser les requêtes pour retourner les stats en < 2 secondes
    - _Exigences : 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ] 22.2 Créer DashboardController
    - Exposer GET /api/admin/dashboard/stats → appeler DashboardService.getStats()
    - Exposer GET /api/admin/dashboard/orders/overview → appeler DashboardService.getOrdersOverview()
    - Exposer GET /api/admin/dashboard/projects → appeler DashboardService.getProjects()
    - Exposer GET /api/admin/users → appeler DashboardService.getAllUsers()
    - _Exigences : 13.1, 13.2, 13.3, 13.4_
  
  - [ ]* 22.3 Écrire les tests unitaires pour DashboardService
    - Tester le calcul des statistiques
    - Tester la récupération des commandes et projets
    - Tester la performance (< 2 secondes)

- [ ] 23. Implémentation de la gestion des utilisateurs
  - [ ] 23.1 Créer UserService et UserServiceImpl
    - Implémenter deleteMyAccount(userId) : supprimer toutes les données personnelles de l'utilisateur (conformité RGPD)
    - _Exigences : 16.6_
  
  - [ ] 23.2 Créer UserController
    - Exposer DELETE /api/users/me → appeler UserService.deleteMyAccount()
    - _Exigences : 16.6_
  
  - [ ]* 23.3 Écrire les tests unitaires pour UserService
    - Tester la suppression de compte

- [ ] 24. Configuration CORS et Swagger
  - [ ] 24.1 Créer CorsConfig
    - Configurer CORS pour autoriser les requêtes depuis http://localhost:5173
    - Autoriser les méthodes GET, POST, PUT, DELETE
    - Autoriser l'en-tête Authorization
    - _Exigences : 15.2_
  
  - [ ] 24.2 Créer SwaggerConfig
    - Configurer SpringDoc OpenAPI 3
    - Ajouter la description de l'API, la version, les informations de contact
    - Configurer le schéma de sécurité JWT (Bearer token)
    - _Exigences : 15.1_
  
  - [ ]* 24.3 Écrire les tests de smoke
    - Tester le démarrage de l'application (GET /actuator/health)
    - Tester l'accessibilité de Swagger UI (GET /swagger-ui.html)
    - Tester la connexion à MySQL

- [ ] 25. Checkpoint - Vérifier toutes les fonctionnalités
  - Vérifier que tous les endpoints fonctionnent correctement
  - Vérifier que la documentation Swagger est complète
  - Vérifier que CORS est configuré correctement
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.


- [ ] 26. Tests d'intégration de bout en bout
  - [ ]* 26.1 Configurer l'environnement de test d'intégration
    - Configurer Spring Boot Test avec base H2 en mémoire
    - Configurer MockMvc ou TestRestTemplate
    - _Exigences : 15.4_
  
  - [ ]* 26.2 Écrire les tests d'intégration pour le flux d'authentification
    - Tester le scénario : inscription → connexion → accès à un endpoint protégé
    - Vérifier que le token JWT est valide et permet l'accès
    - Vérifier que l'accès sans token retourne HTTP 401
    - _Exigences : 1.1, 1.2, 1.6, 1.7_
  
  - [ ]* 26.3 Écrire les tests d'intégration pour le flux de commande
    - Tester le scénario : connexion → création de produit → création de commande → paiement → fidélité
    - Vérifier que le stock est décrémenté
    - Vérifier que les points de fidélité sont crédités
    - Vérifier que la facture est générée
    - _Exigences : 9.1, 9.8, 10.1, 10.2, 10.3, 12.1_
  
  - [ ]* 26.4 Écrire les tests d'intégration pour le flux de gestion des produits
    - Tester le scénario : connexion admin → création de catégorie → création de sous-catégorie → création de produit → ajout d'avis
    - Vérifier que la note moyenne est calculée correctement
    - _Exigences : 2.2, 2.3, 3.3, 5.1, 5.2_
  
  - [ ]* 26.5 Écrire les tests d'intégration pour le flux de gestion des fichiers
    - Tester le scénario : connexion → upload de fichier → récupération de la liste → suppression
    - Vérifier que l'espace utilisé est calculé correctement
    - Vérifier qu'un utilisateur ne peut pas supprimer un fichier d'un autre utilisateur
    - _Exigences : 6.1, 6.2, 6.3, 6.4, 6.6_
  
  - [ ]* 26.6 Écrire les tests d'intégration pour le flux de codes promo
    - Tester le scénario : connexion admin → création de code promo → connexion client → validation du code → création de paiement avec remise
    - Vérifier que la remise est appliquée correctement
    - _Exigences : 11.1, 11.2, 10.5_
  
  - [ ]* 26.7 Écrire les tests d'intégration pour le tableau de bord
    - Tester le scénario : connexion admin → récupération des statistiques → récupération des commandes → récupération des utilisateurs
    - Vérifier que les données sont cohérentes
    - Vérifier que la réponse est retournée en < 2 secondes
    - _Exigences : 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 27. Documentation et finalisation
  - [ ] 27.1 Créer le fichier README.md
    - Ajouter une description du projet
    - Ajouter les instructions de configuration (MySQL, application.properties)
    - Ajouter les instructions de lancement (mvn spring-boot:run)
    - Ajouter les instructions d'accès à Swagger UI
    - Ajouter les informations sur les endpoints principaux
    - Ajouter les informations sur les tests (mvn test)
  
  - [ ] 27.2 Vérifier la journalisation
    - Vérifier que toutes les actions d'écriture sont journalisées avec userId, timestamp et ressource
    - Vérifier que les tentatives d'accès non autorisé sont journalisées en WARN
    - Vérifier que les exceptions non gérées sont journalisées en ERROR avec stack trace
    - _Exigences : 14.3, 16.3_
  
  - [ ] 27.3 Vérifier la conformité RGPD
    - Vérifier que l'endpoint DELETE /api/users/me supprime toutes les données personnelles
    - _Exigences : 16.6_

- [ ] 28. Checkpoint final - Vérifier l'ensemble du système
  - Vérifier que tous les endpoints sont documentés dans Swagger
  - Vérifier que tous les tests (unitaires, propriétés, intégration) passent
  - Vérifier que l'application démarre sans erreur
  - Vérifier que la base de données MySQL est correctement configurée
  - Vérifier que CORS fonctionne avec le frontend React
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.

## Notes

- Les tâches marquées avec `*` sont optionnelles et peuvent être ignorées pour un MVP plus rapide
- Chaque tâche référence les exigences spécifiques pour la traçabilité
- Les checkpoints assurent une validation incrémentale
- Les tests de propriétés valident les propriétés de correction universelles
- Les tests unitaires valident les exemples spécifiques et les cas limites
- Les tests d'intégration valident les flux de bout en bout
