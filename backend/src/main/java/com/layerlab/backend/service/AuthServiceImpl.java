package com.layerlab.backend.service;

import com.layerlab.backend.dto.request.LoginRequest;
import com.layerlab.backend.dto.request.RegisterRequest;
import com.layerlab.backend.dto.response.TwoFactorResponse;
import com.layerlab.backend.entity.Role;
import com.layerlab.backend.entity.User;
import com.layerlab.backend.exception.ConflictException;
import com.layerlab.backend.repository.UserRepository;
import com.layerlab.backend.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of {@link AuthService}.
 *
 * <h3>Registration flow</h3>
 * <ol>
 *   <li>Check email uniqueness — throw {@link ConflictException} if already taken.</li>
 *   <li>Hash the password with BCrypt.</li>
 *   <li>Persist the new {@link User} with {@code ROLE_USER}.</li>
 *   <li>Generate and return a JWT token.</li>
 * </ol>
 *
 * <h3>Login flow</h3>
 * <ol>
 *   <li>Delegate credential verification to Spring Security's {@link AuthenticationManager}
 *       (throws {@code BadCredentialsException} on failure — mapped to HTTP 401 by the
 *       global exception handler).</li>
 *   <li>If 2FA is <em>disabled</em>: issue a JWT token directly.</li>
 *   <li>If 2FA is <em>enabled</em>: generate an OTP, send it by email, and return a
 *       2FA challenge ({@code requiresTwoFactor=true}, {@code userId} set).</li>
 * </ol>
 *
 * <p>Requirements: 1.1, 1.2, 1.3, 1.4, 1.8, 16.4
 */
@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final TwoFactorService twoFactorService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager,
                           TwoFactorService twoFactorService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.twoFactorService = twoFactorService;
    }

    // -------------------------------------------------------------------------
    // register
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     *
     * <p>Requirement 1.1: creates a ROLE_USER account and returns a JWT.
     * Requirement 1.3: throws {@link ConflictException} (HTTP 409) if email already exists.
     * Requirement 1.8: password is hashed with BCrypt before persistence.
     */
    @Override
    public TwoFactorResponse register(RegisterRequest request) {
        // Requirement 1.3 — email uniqueness check
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration attempt with already-used email: {}", request.getEmail());
            throw new ConflictException(
                    "Un compte existe déjà avec l'email : " + request.getEmail());
        }

        // Requirement 1.8 — BCrypt password hashing
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Build and persist the new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(Role.ROLE_USER);
        user.setActive(true);
        user.setTwoFactorEnabled(false);

        userRepository.save(user);
        log.info("New user registered: email={}, role=ROLE_USER", user.getEmail());

        // Requirement 1.1 / 1.2 — issue JWT immediately after registration
        String token = jwtUtil.generateToken(user.getEmail());

        return TwoFactorResponse.builder()
                .requiresTwoFactor(false)
                .userId(null)
                .token(token)
                .build();
    }

    // -------------------------------------------------------------------------
    // login
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     *
     * <p>Requirement 1.2: returns a 24-hour JWT when credentials are valid and 2FA is off.
     * Requirement 1.4: Spring Security's AuthenticationManager throws
     *   {@code BadCredentialsException} on invalid credentials (mapped to HTTP 401).
     * Requirement 16.4: when 2FA is enabled, issues an OTP challenge instead of a JWT.
     */
    @Override
    public TwoFactorResponse login(LoginRequest request) {
        // Requirement 1.4 — delegate credential verification to Spring Security.
        // BadCredentialsException is thrown automatically on failure and propagated
        // to GlobalExceptionHandler → HTTP 401.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Retrieve the full user entity to check 2FA status
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Utilisateur authentifié introuvable en base : " + email));

        // Requirement 16.4 — 2FA branch
        if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            log.info("2FA required for userId={}, generating OTP", user.getId());
            twoFactorService.generateOtp(user.getId());

            return TwoFactorResponse.builder()
                    .requiresTwoFactor(true)
                    .userId(user.getId())
                    .token(null)
                    .build();
        }

        // Standard login — issue JWT directly
        String token = jwtUtil.generateToken(user.getEmail());
        log.info("User logged in successfully: email={}", user.getEmail());

        return TwoFactorResponse.builder()
                .requiresTwoFactor(false)
                .userId(null)
                .token(token)
                .build();
    }
}
