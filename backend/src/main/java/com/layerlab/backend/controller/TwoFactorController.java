package com.layerlab.backend.controller;

import com.layerlab.backend.dto.request.TwoFactorVerifyRequest;
import com.layerlab.backend.dto.response.TwoFactorResponse;
import com.layerlab.backend.entity.User;
import com.layerlab.backend.repository.UserRepository;
import com.layerlab.backend.service.TwoFactorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing Two-Factor Authentication (2FA) endpoints.
 *
 * <ul>
 *   <li>POST /api/auth/2fa/enable  — enable 2FA for the authenticated user</li>
 *   <li>POST /api/auth/2fa/disable — disable 2FA for the authenticated user</li>
 *   <li>POST /api/auth/2fa/verify  — validate OTP and issue the final JWT token</li>
 * </ul>
 *
 * <p>The enable/disable endpoints require a valid JWT (authenticated user).
 * The verify endpoint is publicly accessible (the user does not yet hold a JWT at that point).
 *
 * <p>Requirement: 16.4
 */
@RestController
@RequestMapping("/api/auth/2fa")
@Tag(name = "Two-Factor Authentication", description = "Endpoints for managing and verifying 2FA")
public class TwoFactorController {

    private final TwoFactorService twoFactorService;
    private final UserRepository userRepository;

    public TwoFactorController(TwoFactorService twoFactorService, UserRepository userRepository) {
        this.twoFactorService = twoFactorService;
        this.userRepository = userRepository;
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/2fa/enable
    // -------------------------------------------------------------------------

    /**
     * Enables 2FA for the currently authenticated user.
     *
     * <p>Requires a valid JWT in the {@code Authorization: Bearer} header.
     *
     * @param userDetails the authenticated user injected by Spring Security
     * @return 200 OK with a confirmation response (requiresTwoFactor=true, no token)
     */
    @Operation(
        summary = "Activer la 2FA",
        description = "Active l'authentification à deux facteurs pour l'utilisateur authentifié.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "2FA activée avec succès"),
        @ApiResponse(responseCode = "401", description = "Token JWT absent ou invalide"),
        @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @PostMapping("/enable")
    public ResponseEntity<TwoFactorResponse> enable(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = resolveUserId(userDetails);
        twoFactorService.enableTwoFactor(userId);

        TwoFactorResponse response = TwoFactorResponse.builder()
                .requiresTwoFactor(true)
                .userId(userId)
                .token(null)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/2fa/disable
    // -------------------------------------------------------------------------

    /**
     * Disables 2FA for the currently authenticated user.
     *
     * <p>Requires a valid JWT in the {@code Authorization: Bearer} header.
     *
     * @param userDetails the authenticated user injected by Spring Security
     * @return 200 OK with a confirmation response (requiresTwoFactor=false, no token)
     */
    @Operation(
        summary = "Désactiver la 2FA",
        description = "Désactive l'authentification à deux facteurs pour l'utilisateur authentifié.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "2FA désactivée avec succès"),
        @ApiResponse(responseCode = "401", description = "Token JWT absent ou invalide"),
        @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @PostMapping("/disable")
    public ResponseEntity<TwoFactorResponse> disable(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = resolveUserId(userDetails);
        twoFactorService.disableTwoFactor(userId);

        TwoFactorResponse response = TwoFactorResponse.builder()
                .requiresTwoFactor(false)
                .userId(null)
                .token(null)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------------------------
    // POST /api/auth/2fa/verify
    // -------------------------------------------------------------------------

    /**
     * Validates the OTP code submitted by the user and, on success, issues the final JWT token.
     *
     * <p>This endpoint is publicly accessible — the user does not yet hold a JWT at this stage.
     * The {@code userId} and {@code otpCode} are provided in the request body.
     *
     * @param request DTO containing userId and the 6-digit OTP code
     * @return 200 OK with a {@link TwoFactorResponse} carrying the JWT token
     *         (requiresTwoFactor=false, token set)
     */
    @Operation(
        summary = "Valider le code OTP",
        description = "Valide le code OTP soumis par l'utilisateur et émet le token JWT final."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "OTP valide — token JWT émis"),
        @ApiResponse(responseCode = "400", description = "Requête invalide (champs manquants ou malformés)"),
        @ApiResponse(responseCode = "422", description = "Code OTP invalide, expiré ou déjà utilisé")
    })
    @PostMapping("/verify")
    public ResponseEntity<TwoFactorResponse> verify(
            @Valid @RequestBody TwoFactorVerifyRequest request) {

        String token = twoFactorService.validateOtp(request.getUserId(), request.getOtpCode());

        TwoFactorResponse response = TwoFactorResponse.builder()
                .requiresTwoFactor(false)
                .userId(null)
                .token(token)
                .build();

        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Resolves the database ID of the currently authenticated user from their email (principal).
     *
     * @param userDetails Spring Security principal
     * @return the user's database ID
     * @throws com.layerlab.backend.exception.ResourceNotFoundException if the user is not found
     */
    private Long resolveUserId(UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.layerlab.backend.exception.ResourceNotFoundException(
                        "Utilisateur introuvable avec l'email : " + email));
        return user.getId();
    }
}
