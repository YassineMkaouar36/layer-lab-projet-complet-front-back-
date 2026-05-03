package com.layerlab.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.layerlab.backend.dto.request.LoginRequest;
import com.layerlab.backend.dto.request.RegisterRequest;
import com.layerlab.backend.dto.response.TwoFactorResponse;
import com.layerlab.backend.exception.ConflictException;
import com.layerlab.backend.exception.GlobalExceptionHandler;
import com.layerlab.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for {@link AuthController} using standalone MockMvc.
 *
 * <p>Covers HTTP-layer concerns: status codes, request validation (HTTP 400),
 * and error response structure. Business logic is mocked via {@link AuthService}.
 *
 * <p>Covers:
 * <ul>
 *   <li>HTTP 201 on successful registration (Requirement 1.1)</li>
 *   <li>HTTP 200 on successful login (Requirement 1.2)</li>
 *   <li>HTTP 400 on invalid fields — malformed email, short password, missing fields
 *       (Requirement 1.5)</li>
 *   <li>HTTP 409 on duplicate email (Requirement 1.3)</li>
 *   <li>HTTP 401 on bad credentials (Requirement 1.4)</li>
 *   <li>HTTP 200 with 2FA challenge when 2FA is enabled (Requirement 16.4)</li>
 * </ul>
 *
 * <p>Task: 8.3
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController — Unit Tests (MockMvc standalone)")
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private static final String REGISTER_URL = "/api/auth/register";
    private static final String LOGIN_URL    = "/api/auth/login";

    private static final String EMAIL    = "alice@example.com";
    private static final String PASSWORD = "securePass1";
    private static final String TOKEN    = "eyJhbGciOiJIUzI1NiJ9.test.token";

    @BeforeEach
    void setUp() {
        // Standalone setup — no Spring context, but includes the GlobalExceptionHandler
        // so that @ControllerAdvice mappings are exercised.
        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    // =========================================================================
    // POST /api/auth/register
    // =========================================================================

    @Nested
    @DisplayName("POST /api/auth/register")
    class RegisterEndpointTests {

        /**
         * Requirement 1.1 / 1.2 — successful registration returns HTTP 201 with a JWT.
         */
        @Test
        @DisplayName("Valid payload → HTTP 201 with JWT token")
        void register_WithValidPayload_ShouldReturn201WithToken() throws Exception {
            // Given
            TwoFactorResponse serviceResponse = TwoFactorResponse.builder()
                    .requiresTwoFactor(false)
                    .userId(null)
                    .token(TOKEN)
                    .build();
            when(authService.register(any(RegisterRequest.class))).thenReturn(serviceResponse);

            RegisterRequest request = new RegisterRequest(
                    "Alice", "Dupont", EMAIL, PASSWORD, "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.token").value(TOKEN))
                    .andExpect(jsonPath("$.requiresTwoFactor").value(false));
        }

        /**
         * Requirement 1.3 — duplicate email returns HTTP 409.
         */
        @Test
        @DisplayName("Duplicate email → HTTP 409")
        void register_WithDuplicateEmail_ShouldReturn409() throws Exception {
            // Given
            when(authService.register(any(RegisterRequest.class)))
                    .thenThrow(new ConflictException("Un compte existe déjà avec l'email : " + EMAIL));

            RegisterRequest request = new RegisterRequest(
                    "Alice", "Dupont", EMAIL, PASSWORD, "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409))
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.path").exists());
        }

        /**
         * Requirement 1.5 — malformed email returns HTTP 400.
         */
        @Test
        @DisplayName("Malformed email → HTTP 400 (Requirement 1.5)")
        void register_WithMalformedEmail_ShouldReturn400() throws Exception {
            // Given — invalid email format
            RegisterRequest request = new RegisterRequest(
                    "Alice", "Dupont", "not-an-email", PASSWORD, "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        /**
         * Requirement 1.5 — password shorter than 8 characters returns HTTP 400.
         */
        @Test
        @DisplayName("Password < 8 chars → HTTP 400 (Requirement 1.5)")
        void register_WithShortPassword_ShouldReturn400() throws Exception {
            // Given — password is only 5 characters
            RegisterRequest request = new RegisterRequest(
                    "Alice", "Dupont", EMAIL, "short", "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        /**
         * Requirement 1.5 — missing firstName returns HTTP 400.
         */
        @Test
        @DisplayName("Missing firstName → HTTP 400 (Requirement 1.5)")
        void register_WithMissingFirstName_ShouldReturn400() throws Exception {
            // Given — firstName is blank
            RegisterRequest request = new RegisterRequest(
                    "", "Dupont", EMAIL, PASSWORD, "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        /**
         * Requirement 1.5 — missing email field returns HTTP 400.
         */
        @Test
        @DisplayName("Missing email → HTTP 400 (Requirement 1.5)")
        void register_WithMissingEmail_ShouldReturn400() throws Exception {
            // Given — email is blank
            RegisterRequest request = new RegisterRequest(
                    "Alice", "Dupont", "", PASSWORD, "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        /**
         * Requirement 1.5 — missing password field returns HTTP 400.
         */
        @Test
        @DisplayName("Missing password → HTTP 400 (Requirement 1.5)")
        void register_WithMissingPassword_ShouldReturn400() throws Exception {
            // Given — password is blank
            RegisterRequest request = new RegisterRequest(
                    "Alice", "Dupont", EMAIL, "", "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        /**
         * Requirement 14.1 — error response must contain status, message, timestamp, path.
         */
        @Test
        @DisplayName("Error response has uniform structure (Requirement 14.1)")
        void register_ValidationError_ShouldReturnUniformErrorStructure() throws Exception {
            // Given — malformed email triggers validation error
            RegisterRequest request = new RegisterRequest(
                    "Alice", "Dupont", "bad-email", PASSWORD, "+21612345678", "12 Rue de Tunis"
            );

            // When & Then
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.path").exists());
        }
    }

    // =========================================================================
    // POST /api/auth/login
    // =========================================================================

    @Nested
    @DisplayName("POST /api/auth/login")
    class LoginEndpointTests {

        /**
         * Requirement 1.2 — valid credentials with 2FA off returns HTTP 200 with JWT.
         */
        @Test
        @DisplayName("Valid credentials, 2FA off → HTTP 200 with JWT")
        void login_WithValidCredentials_ShouldReturn200WithToken() throws Exception {
            // Given
            TwoFactorResponse serviceResponse = TwoFactorResponse.builder()
                    .requiresTwoFactor(false)
                    .userId(null)
                    .token(TOKEN)
                    .build();
            when(authService.login(any(LoginRequest.class))).thenReturn(serviceResponse);

            LoginRequest request = new LoginRequest();
            request.setEmail(EMAIL);
            request.setPassword(PASSWORD);

            // When & Then
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(TOKEN))
                    .andExpect(jsonPath("$.requiresTwoFactor").value(false));
        }

        /**
         * Requirement 16.4 — valid credentials with 2FA on returns HTTP 200 with challenge.
         */
        @Test
        @DisplayName("Valid credentials, 2FA on → HTTP 200 with 2FA challenge (Requirement 16.4)")
        void login_With2FAEnabled_ShouldReturn200WithChallenge() throws Exception {
            // Given
            TwoFactorResponse challengeResponse = TwoFactorResponse.builder()
                    .requiresTwoFactor(true)
                    .userId(42L)
                    .token(null)
                    .build();
            when(authService.login(any(LoginRequest.class))).thenReturn(challengeResponse);

            LoginRequest request = new LoginRequest();
            request.setEmail(EMAIL);
            request.setPassword(PASSWORD);

            // When & Then
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.requiresTwoFactor").value(true))
                    .andExpect(jsonPath("$.userId").value(42))
                    .andExpect(jsonPath("$.token").doesNotExist());
        }

        /**
         * Requirement 1.4 — bad credentials returns HTTP 401.
         */
        @Test
        @DisplayName("Bad credentials → HTTP 401 (Requirement 1.4)")
        void login_WithBadCredentials_ShouldReturn401() throws Exception {
            // Given
            when(authService.login(any(LoginRequest.class)))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            LoginRequest request = new LoginRequest();
            request.setEmail(EMAIL);
            request.setPassword(PASSWORD);

            // When & Then
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value(401))
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.path").exists());
        }

        /**
         * Requirement 1.5 — malformed email in login request returns HTTP 400.
         */
        @Test
        @DisplayName("Malformed email in login → HTTP 400 (Requirement 1.5)")
        void login_WithMalformedEmail_ShouldReturn400() throws Exception {
            // Given
            LoginRequest request = new LoginRequest();
            request.setEmail("not-an-email");
            request.setPassword(PASSWORD);

            // When & Then
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        /**
         * Requirement 1.5 — blank email in login request returns HTTP 400.
         */
        @Test
        @DisplayName("Blank email in login → HTTP 400 (Requirement 1.5)")
        void login_WithBlankEmail_ShouldReturn400() throws Exception {
            // Given
            LoginRequest request = new LoginRequest();
            request.setEmail("");
            request.setPassword(PASSWORD);

            // When & Then
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        /**
         * Requirement 1.5 — blank password in login request returns HTTP 400.
         */
        @Test
        @DisplayName("Blank password in login → HTTP 400 (Requirement 1.5)")
        void login_WithBlankPassword_ShouldReturn400() throws Exception {
            // Given
            LoginRequest request = new LoginRequest();
            request.setEmail(EMAIL);
            request.setPassword("");

            // When & Then
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }
    }
}
