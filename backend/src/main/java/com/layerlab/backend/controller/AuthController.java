package com.layerlab.backend.controller;

import com.layerlab.backend.dto.request.LoginRequest;
import com.layerlab.backend.dto.request.RegisterRequest;
import com.layerlab.backend.dto.response.TwoFactorResponse;
import com.layerlab.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing authentication endpoints.
 *
 * <ul>
 *   <li>POST /api/auth/register — create a new user account</li>
 *   <li>POST /api/auth/login    — authenticate and obtain a JWT (or a 2FA challenge)</li>
 * </ul>
 *
 * <p>Both endpoints are publicly accessible (no JWT required).
 * The 2FA verify/enable/disable endpoints are handled by {@link TwoFactorController}.
 *
 * <p>Requirements: 1.1, 1.2, 16.4
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/register
    // -------------------------------------------------------------------------

    /**
     * Registers a new user account.
     *
     * <p>On success, returns HTTP 201 with a {@link TwoFactorResponse} containing the JWT token
     * ({@code requiresTwoFactor=false}, {@code token} set).
     *
     * <p>Requirements: 1.1, 1.2, 1.3, 1.5, 1.8
     *
     * @param request the registration payload — validated by Hibernate Validator
     * @return 201 Created with the JWT token
     */
    @Operation(
        summary = "Inscription",
        description = "Crée un nouveau compte utilisateur avec le rôle ROLE_USER et retourne un token JWT."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Compte créé avec succès — token JWT retourné",
            content = @Content(schema = @Schema(implementation = TwoFactorResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Données invalides (email malformé, mot de passe < 8 caractères, champ manquant)"
        ),
        @ApiResponse(
            responseCode = "409",
            description = "Email déjà utilisé par un autre compte"
        )
    })
    @PostMapping("/register")
    public ResponseEntity<TwoFactorResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        TwoFactorResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/login
    // -------------------------------------------------------------------------

    /**
     * Authenticates an existing user.
     *
     * <p>Two possible outcomes:
     * <ul>
     *   <li><strong>2FA disabled</strong>: returns HTTP 200 with a JWT token
     *       ({@code requiresTwoFactor=false}, {@code token} set).</li>
     *   <li><strong>2FA enabled</strong>: generates and emails an OTP, then returns HTTP 200
     *       with a 2FA challenge ({@code requiresTwoFactor=true}, {@code userId} set,
     *       {@code token=null}). The client must then call
     *       {@code POST /api/auth/2fa/verify} with the OTP to obtain the JWT.</li>
     * </ul>
     *
     * <p>Requirements: 1.2, 1.4, 16.4
     *
     * @param request the login payload — validated by Hibernate Validator
     * @return 200 OK with either a JWT token or a 2FA challenge
     */
    @Operation(
        summary = "Connexion",
        description = """
            Authentifie l'utilisateur et retourne soit un token JWT (si 2FA désactivée),
            soit un challenge 2FA (requiresTwoFactor=true + userId) si la 2FA est activée.
            Dans ce dernier cas, un code OTP est envoyé par email et doit être validé via
            POST /api/auth/2fa/verify pour obtenir le token JWT.
            """
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Authentification réussie — token JWT ou challenge 2FA retourné",
            content = @Content(schema = @Schema(implementation = TwoFactorResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Données invalides (email malformé, champ manquant)"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Identifiants incorrects"
        )
    })
    @PostMapping("/login")
    public ResponseEntity<TwoFactorResponse> login(
            @Valid @RequestBody LoginRequest request) {

        TwoFactorResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
