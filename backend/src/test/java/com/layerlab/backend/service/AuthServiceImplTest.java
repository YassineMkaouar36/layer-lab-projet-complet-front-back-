package com.layerlab.backend.service;

import com.layerlab.backend.dto.request.LoginRequest;
import com.layerlab.backend.dto.request.RegisterRequest;
import com.layerlab.backend.dto.response.TwoFactorResponse;
import com.layerlab.backend.entity.Role;
import com.layerlab.backend.entity.User;
import com.layerlab.backend.exception.ConflictException;
import com.layerlab.backend.repository.UserRepository;
import com.layerlab.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthServiceImpl}.
 *
 * <p>Uses hand-written stubs for ALL types that Mockito's Byte Buddy cannot instrument
 * on Java 25 (concrete classes AND interfaces from the JDK/Spring Security hierarchy).
 * Only pure application interfaces ({@link UserRepository}, {@link AuthenticationManager},
 * {@link TwoFactorService}) are mocked via Mockito.
 *
 * <p>Covers:
 * <ul>
 *   <li>Nominal registration (Requirement 1.1, 1.2, 1.8)</li>
 *   <li>Nominal login without 2FA (Requirement 1.2)</li>
 *   <li>Login with 2FA enabled — returns challenge (Requirement 16.4)</li>
 *   <li>Email already used → ConflictException / HTTP 409 (Requirement 1.3)</li>
 *   <li>Bad credentials → BadCredentialsException / HTTP 401 (Requirement 1.4)</li>
 * </ul>
 *
 * <p>Task: 8.3
 */
@DisplayName("AuthServiceImpl — Unit Tests")
class AuthServiceImplTest {

    // =========================================================================
    // Hand-written stubs (Java 25 / Byte Buddy safe)
    // =========================================================================

    /**
     * Stub for {@link JwtUtil} — returns a predictable token without real JWT signing.
     */
    private static class StubJwtUtil extends JwtUtil {

        static final String FIXED_TOKEN = "stub.jwt.token";

        volatile String lastGeneratedEmail;

        StubJwtUtil() throws Exception {
            setField(this, "secret",
                    "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
            setField(this, "expirationMs", 86_400_000L);
        }

        @Override
        public String generateToken(String email) {
            this.lastGeneratedEmail = email;
            return FIXED_TOKEN;
        }

        @Override
        public boolean validateToken(String token) {
            return FIXED_TOKEN.equals(token);
        }

        private static void setField(Object target, String name, Object value) throws Exception {
            Field f = JwtUtil.class.getDeclaredField(name);
            f.setAccessible(true);
            f.set(target, value);
        }
    }

    /**
     * Stub for {@link PasswordEncoder} — deterministic hash, no BCrypt overhead.
     */
    private static class StubPasswordEncoder implements PasswordEncoder {

        static final String HASH_PREFIX = "HASHED:";

        volatile String lastRawPassword;

        @Override
        public String encode(CharSequence rawPassword) {
            this.lastRawPassword = rawPassword.toString();
            return HASH_PREFIX + rawPassword;
        }

        @Override
        public boolean matches(CharSequence rawPassword, String encodedPassword) {
            return encodedPassword.equals(HASH_PREFIX + rawPassword);
        }
    }

    /**
     * Minimal hand-written stub for {@link Authentication}.
     *
     * <p>Spring Security's {@code Authentication} extends {@code java.security.Principal}
     * and {@code java.io.Serializable}, both of which are JDK interfaces that Byte Buddy
     * cannot instrument on Java 25. This stub avoids the issue entirely.
     */
    private static class StubAuthentication implements Authentication {

        private final String name;

        StubAuthentication(String name) {
            this.name = name;
        }

        @Override public String getName()                                    { return name; }
        @Override public Collection<? extends GrantedAuthority> getAuthorities() { return Collections.emptyList(); }
        @Override public Object getCredentials()                             { return null; }
        @Override public Object getDetails()                                 { return null; }
        @Override public Object getPrincipal()                               { return name; }
        @Override public boolean isAuthenticated()                           { return true; }
        @Override public void setAuthenticated(boolean b)                    {}
    }

    // =========================================================================
    // Test fixtures
    // =========================================================================

    private static final String EMAIL    = "alice@example.com";
    private static final String PASSWORD = "securePass1";

    // Interfaces — safe to mock with Mockito on Java 25
    private UserRepository        userRepository;
    private AuthenticationManager authenticationManager;
    private TwoFactorService      twoFactorService;

    // Concrete / JDK stubs — avoid Byte Buddy instrumentation
    private StubJwtUtil           jwtUtil;
    private StubPasswordEncoder   passwordEncoder;

    private AuthServiceImpl authService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest    validLoginRequest;
    private User            savedUser;

    @BeforeEach
    void setUp() throws Exception {
        userRepository        = mock(UserRepository.class);
        authenticationManager = mock(AuthenticationManager.class);
        twoFactorService      = mock(TwoFactorService.class);
        jwtUtil               = new StubJwtUtil();
        passwordEncoder       = new StubPasswordEncoder();

        authService = new AuthServiceImpl(
                userRepository, passwordEncoder, jwtUtil, authenticationManager, twoFactorService);

        validRegisterRequest = new RegisterRequest(
                "Alice", "Dupont", EMAIL, PASSWORD, "+21612345678", "12 Rue de Tunis");

        validLoginRequest = new LoginRequest();
        validLoginRequest.setEmail(EMAIL);
        validLoginRequest.setPassword(PASSWORD);

        savedUser = new User();
        savedUser.setId(1L);
        savedUser.setFirstName("Alice");
        savedUser.setLastName("Dupont");
        savedUser.setEmail(EMAIL);
        savedUser.setPassword(StubPasswordEncoder.HASH_PREFIX + PASSWORD);
        savedUser.setPhone("+21612345678");
        savedUser.setAddress("12 Rue de Tunis");
        savedUser.setRole(Role.ROLE_USER);
        savedUser.setActive(true);
        savedUser.setTwoFactorEnabled(false);
    }

    // =========================================================================
    // register()
    // =========================================================================

    @Nested
    @DisplayName("register()")
    class RegisterTests {

        /**
         * Requirement 1.1 / 1.2 / 1.8 — nominal registration.
         */
        @Test
        @DisplayName("Nominal — new user is persisted and JWT is returned")
        void register_WithValidRequest_ShouldPersistUserAndReturnToken() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
            AtomicReference<User> capturedUser = new AtomicReference<>();
            when(userRepository.save(any(User.class))).thenAnswer(inv -> {
                capturedUser.set(inv.getArgument(0));
                return inv.getArgument(0);
            });

            // When
            TwoFactorResponse response = authService.register(validRegisterRequest);

            // Then — response
            assertThat(response).isNotNull();
            assertThat(response.isRequiresTwoFactor()).isFalse();
            assertThat(response.getToken()).isEqualTo(StubJwtUtil.FIXED_TOKEN);
            assertThat(response.getUserId()).isNull();

            // Then — password was hashed (Requirement 1.8)
            assertThat(passwordEncoder.lastRawPassword).isEqualTo(PASSWORD);

            // Then — persisted user fields
            User persisted = capturedUser.get();
            assertThat(persisted).isNotNull();
            assertThat(persisted.getEmail()).isEqualTo(EMAIL);
            assertThat(persisted.getPassword()).isEqualTo(StubPasswordEncoder.HASH_PREFIX + PASSWORD);
            assertThat(persisted.getRole()).isEqualTo(Role.ROLE_USER);
            assertThat(persisted.getActive()).isTrue();
            assertThat(persisted.getTwoFactorEnabled()).isFalse();

            // Then — JWT generated with the user's email (Requirement 1.2)
            assertThat(jwtUtil.lastGeneratedEmail).isEqualTo(EMAIL);
        }

        /**
         * Requirement 1.8 — raw password must never be stored.
         */
        @Test
        @DisplayName("Password is hashed before persistence — plain text is never stored (Req 1.8)")
        void register_ShouldNeverPersistPlainTextPassword() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
            AtomicReference<User> capturedUser = new AtomicReference<>();
            when(userRepository.save(any(User.class))).thenAnswer(inv -> {
                capturedUser.set(inv.getArgument(0));
                return inv.getArgument(0);
            });

            // When
            authService.register(validRegisterRequest);

            // Then
            User persisted = capturedUser.get();
            assertThat(persisted.getPassword())
                    .isNotEqualTo(PASSWORD)
                    .startsWith(StubPasswordEncoder.HASH_PREFIX);
        }

        /**
         * Requirement 1.3 — duplicate email must throw ConflictException (HTTP 409).
         */
        @Test
        @DisplayName("Duplicate email → ConflictException (HTTP 409, Requirement 1.3)")
        void register_WithExistingEmail_ShouldThrowConflictException() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> authService.register(validRegisterRequest))
                    .isInstanceOf(ConflictException.class)
                    .hasMessageContaining(EMAIL);

            verify(userRepository, never()).save(any());
            assertThat(passwordEncoder.lastRawPassword).isNull();
        }

        /**
         * Requirement 1.1 — response must have requiresTwoFactor=false and a non-null token.
         */
        @Test
        @DisplayName("Response has requiresTwoFactor=false and non-null token after registration")
        void register_ShouldReturnDirectTokenWithoutTwoFactorChallenge() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
            when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

            // When
            TwoFactorResponse response = authService.register(validRegisterRequest);

            // Then
            assertThat(response.isRequiresTwoFactor()).isFalse();
            assertThat(response.getToken()).isNotNull().isNotBlank();
            assertThat(response.getUserId()).isNull();
        }

        /**
         * New accounts must always be created with ROLE_USER.
         */
        @Test
        @DisplayName("New accounts are always created with ROLE_USER")
        void register_ShouldAlwaysAssignRoleUser() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
            AtomicReference<User> capturedUser = new AtomicReference<>();
            when(userRepository.save(any(User.class))).thenAnswer(inv -> {
                capturedUser.set(inv.getArgument(0));
                return inv.getArgument(0);
            });

            // When
            authService.register(validRegisterRequest);

            // Then
            assertThat(capturedUser.get().getRole()).isEqualTo(Role.ROLE_USER);
        }

        /**
         * New accounts must be created with active=true.
         */
        @Test
        @DisplayName("New accounts are created with active=true")
        void register_ShouldCreateActiveAccount() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
            AtomicReference<User> capturedUser = new AtomicReference<>();
            when(userRepository.save(any(User.class))).thenAnswer(inv -> {
                capturedUser.set(inv.getArgument(0));
                return inv.getArgument(0);
            });

            // When
            authService.register(validRegisterRequest);

            // Then
            assertThat(capturedUser.get().getActive()).isTrue();
        }

        /**
         * New accounts must have twoFactorEnabled=false.
         */
        @Test
        @DisplayName("New accounts have twoFactorEnabled=false by default")
        void register_ShouldCreate2FADisabledAccount() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
            AtomicReference<User> capturedUser = new AtomicReference<>();
            when(userRepository.save(any(User.class))).thenAnswer(inv -> {
                capturedUser.set(inv.getArgument(0));
                return inv.getArgument(0);
            });

            // When
            authService.register(validRegisterRequest);

            // Then
            assertThat(capturedUser.get().getTwoFactorEnabled()).isFalse();
        }

        /**
         * Email uniqueness must be checked before password encoding.
         */
        @Test
        @DisplayName("Email uniqueness is checked before password encoding")
        void register_EmailCheckHappensBeforePasswordEncoding() {
            // Given
            when(userRepository.existsByEmail(EMAIL)).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> authService.register(validRegisterRequest))
                    .isInstanceOf(ConflictException.class);

            assertThat(passwordEncoder.lastRawPassword).isNull();
        }
    }

    // =========================================================================
    // login() — 2FA disabled
    // =========================================================================

    @Nested
    @DisplayName("login() — 2FA disabled")
    class LoginWithout2FATests {

        /**
         * Requirement 1.2 — nominal login without 2FA returns a JWT directly.
         */
        @Test
        @DisplayName("Nominal — valid credentials, 2FA off → JWT returned directly")
        void login_WithValidCredentialsAnd2FADisabled_ShouldReturnToken() {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(new StubAuthentication(EMAIL));
            when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(savedUser));

            // When
            TwoFactorResponse response = authService.login(validLoginRequest);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.isRequiresTwoFactor()).isFalse();
            assertThat(response.getToken()).isEqualTo(StubJwtUtil.FIXED_TOKEN);
            assertThat(response.getUserId()).isNull();
            assertThat(jwtUtil.lastGeneratedEmail).isEqualTo(EMAIL);
            verify(twoFactorService, never()).generateOtp(anyLong());
        }

        /**
         * Requirement 1.4 — bad credentials must propagate BadCredentialsException (HTTP 401).
         */
        @Test
        @DisplayName("Bad credentials → BadCredentialsException (HTTP 401, Requirement 1.4)")
        void login_WithBadCredentials_ShouldThrowBadCredentialsException() {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            // When & Then
            assertThatThrownBy(() -> authService.login(validLoginRequest))
                    .isInstanceOf(BadCredentialsException.class);

            verify(userRepository, never()).findByEmail(anyString());
            assertThat(jwtUtil.lastGeneratedEmail).isNull();
        }

        /**
         * AuthenticationManager must be called with the submitted credentials.
         */
        @Test
        @DisplayName("AuthenticationManager is called with the submitted credentials")
        void login_ShouldDelegateCredentialCheckToAuthenticationManager() {
            // Given
            AtomicReference<UsernamePasswordAuthenticationToken> capturedToken =
                    new AtomicReference<>();
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenAnswer(inv -> {
                        capturedToken.set(inv.getArgument(0));
                        return new StubAuthentication(EMAIL);
                    });
            when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(savedUser));

            // When
            authService.login(validLoginRequest);

            // Then
            UsernamePasswordAuthenticationToken token = capturedToken.get();
            assertThat(token).isNotNull();
            assertThat(token.getPrincipal()).isEqualTo(EMAIL);
            assertThat(token.getCredentials()).isEqualTo(PASSWORD);
        }
    }

    // =========================================================================
    // login() — 2FA enabled
    // =========================================================================

    @Nested
    @DisplayName("login() — 2FA enabled")
    class LoginWith2FATests {

        private User userWith2FA;

        @BeforeEach
        void setUp2FAUser() {
            userWith2FA = new User();
            userWith2FA.setId(42L);
            userWith2FA.setFirstName("Bob");
            userWith2FA.setLastName("Martin");
            userWith2FA.setEmail(EMAIL);
            userWith2FA.setPassword(StubPasswordEncoder.HASH_PREFIX + PASSWORD);
            userWith2FA.setRole(Role.ROLE_USER);
            userWith2FA.setActive(true);
            userWith2FA.setTwoFactorEnabled(true);
        }

        /**
         * Requirement 16.4 — 2FA enabled → challenge returned, OTP generated.
         */
        @Test
        @DisplayName("2FA enabled → OTP generated, challenge returned (Requirement 16.4)")
        void login_With2FAEnabled_ShouldReturnChallengeAndGenerateOtp() {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(new StubAuthentication(EMAIL));
            when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(userWith2FA));
            doNothing().when(twoFactorService).generateOtp(42L);

            // When
            TwoFactorResponse response = authService.login(validLoginRequest);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.isRequiresTwoFactor()).isTrue();
            assertThat(response.getUserId()).isEqualTo(42L);
            assertThat(response.getToken()).isNull();

            verify(twoFactorService).generateOtp(42L);
            assertThat(jwtUtil.lastGeneratedEmail).isNull();
        }

        /**
         * Requirement 16.4 — bad credentials with 2FA enabled must fail before OTP generation.
         */
        @Test
        @DisplayName("Bad credentials with 2FA enabled → BadCredentialsException, no OTP generated")
        void login_With2FAEnabledAndBadCredentials_ShouldThrowBeforeGeneratingOtp() {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            // When & Then
            assertThatThrownBy(() -> authService.login(validLoginRequest))
                    .isInstanceOf(BadCredentialsException.class);

            verify(twoFactorService, never()).generateOtp(anyLong());
            assertThat(jwtUtil.lastGeneratedEmail).isNull();
        }

        /**
         * Requirement 16.4 — challenge response must carry the correct userId.
         */
        @Test
        @DisplayName("Challenge response carries the correct userId")
        void login_With2FAEnabled_ChallengeMustCarryCorrectUserId() {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(new StubAuthentication(EMAIL));
            when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(userWith2FA));

            // When
            TwoFactorResponse response = authService.login(validLoginRequest);

            // Then
            assertThat(response.getUserId()).isEqualTo(userWith2FA.getId());
        }
    }

    // =========================================================================
    // OTP delegation
    // =========================================================================

    @Nested
    @DisplayName("OTP delegation to TwoFactorService")
    class OtpDelegationTests {

        /**
         * Requirement 16.4 — login with 2FA triggers TwoFactorService.generateOtp()
         * with the correct userId.
         */
        @Test
        @DisplayName("Login with 2FA triggers TwoFactorService.generateOtp with the correct userId")
        void login_With2FAEnabled_ShouldCallGenerateOtpWithCorrectUserId() {
            // Given
            User user2FA = new User();
            user2FA.setId(99L);
            user2FA.setEmail(EMAIL);
            user2FA.setPassword(StubPasswordEncoder.HASH_PREFIX + PASSWORD);
            user2FA.setRole(Role.ROLE_USER);
            user2FA.setActive(true);
            user2FA.setTwoFactorEnabled(true);

            when(authenticationManager.authenticate(any())).thenReturn(new StubAuthentication(EMAIL));
            when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user2FA));

            // When
            authService.login(validLoginRequest);

            // Then
            verify(twoFactorService).generateOtp(99L);
        }
    }

    // =========================================================================
    // Edge cases
    // =========================================================================

    @Nested
    @DisplayName("Edge cases")
    class EdgeCaseTests {

        /**
         * twoFactorEnabled=null must be treated as 2FA disabled
         * (Boolean.TRUE.equals(null) == false).
         */
        @Test
        @DisplayName("twoFactorEnabled=null is treated as 2FA disabled (defensive null-check)")
        void login_WithTwoFactorEnabledNull_ShouldTreatAs2FADisabled() {
            // Given
            User userNullFlag = new User();
            userNullFlag.setId(5L);
            userNullFlag.setEmail(EMAIL);
            userNullFlag.setPassword(StubPasswordEncoder.HASH_PREFIX + PASSWORD);
            userNullFlag.setRole(Role.ROLE_USER);
            userNullFlag.setActive(true);
            userNullFlag.setTwoFactorEnabled(null);

            when(authenticationManager.authenticate(any())).thenReturn(new StubAuthentication(EMAIL));
            when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(userNullFlag));

            // When
            TwoFactorResponse response = authService.login(validLoginRequest);

            // Then — must return a direct JWT, not a 2FA challenge
            assertThat(response.isRequiresTwoFactor()).isFalse();
            assertThat(response.getToken()).isEqualTo(StubJwtUtil.FIXED_TOKEN);
            verify(twoFactorService, never()).generateOtp(anyLong());
        }
    }
}
