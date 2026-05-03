package com.layerlab.backend.service;

import com.layerlab.backend.dto.request.LoginRequest;
import com.layerlab.backend.dto.request.RegisterRequest;
import com.layerlab.backend.dto.response.TwoFactorResponse;
import com.layerlab.backend.entity.Role;
import com.layerlab.backend.entity.User;
import com.layerlab.backend.exception.ConflictException;
import com.layerlab.backend.exception.ResourceNotFoundException;
import com.layerlab.backend.exception.UnprocessableEntityException;
import com.layerlab.backend.repository.UserRepository;
import com.layerlab.backend.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of {@link AuthService}.
 *
 * <h3>Registration flow</h3>
 * <ol>
 *   <li>Check email uniqueness — throw {@link ConflictException} if already taken.</li>
 *   <li>Hash the password with BCrypt.</li>
 *   <li>Persist the new {@link User} with {@code active=false} pending email verification.</li>
 *   <li>Send a verification email with a unique token link.</li>
 * </ol>
 *
 * <h3>Login flow</h3>
 * <ol>
 *   <li>Delegate credential verification to Spring Security's {@link AuthenticationManager}.</li>
 *   <li>Reject login if email is not verified yet.</li>
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
    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager,
                           TwoFactorService twoFactorService,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.twoFactorService = twoFactorService;
        this.emailService = emailService;
    }

    // -------------------------------------------------------------------------
    // register
    // -------------------------------------------------------------------------

    /**
     * Creates a new inactive account and sends a verification email.
     * The account is only activated after the user clicks the link.
     */
    @Override
    public TwoFactorResponse register(RegisterRequest request) {
        // Email uniqueness check
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration attempt with already-used email: {}", request.getEmail());
            throw new ConflictException(
                    "Un compte existe déjà avec l'email : " + request.getEmail());
        }

        log.info("Register request received: email={}", request.getEmail());

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Generate a unique verification token
        String verificationToken = UUID.randomUUID().toString();

        // Build user — inactive until email is verified
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(Role.ROLE_USER);
        user.setActive(false);           // disabled until verified
        user.setEmailVerified(false);
        user.setEmailVerificationToken(verificationToken);
        user.setTwoFactorEnabled(true);

        userRepository.save(user);
        log.info("New user registered (pending verification): email={}", user.getEmail());

        // Send verification email
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
        emailService.sendVerificationEmail(user.getEmail(), verificationUrl);

        // Return without token — user must verify email first
        return TwoFactorResponse.builder()
                .requiresTwoFactor(false)
                .userId(null)
                .token(null)
                .build();
    }

    // -------------------------------------------------------------------------
    // verifyEmail
    // -------------------------------------------------------------------------

    /**
     * Activates the account associated with the given verification token.
     *
     * @param token the UUID token from the verification link
     * @throws UnprocessableEntityException if the token is invalid or already used
     */
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new UnprocessableEntityException(
                        "Lien de vérification invalide ou déjà utilisé."));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            // Already verified — clear token silently, no error
            user.setEmailVerificationToken(null);
            userRepository.save(user);
            return;
        }

        user.setActive(true);
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null); // single-use
        userRepository.save(user);
        log.info("Email verified and account activated for userId={}", user.getId());
    }

    // -------------------------------------------------------------------------
    // login
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     *
     * <p>Rejects login if email is not verified.
     * Requirement 16.4: when 2FA is enabled, issues an OTP challenge instead of a JWT.
     */
    @Override
    public TwoFactorResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Utilisateur authentifié introuvable en base : " + email));

        // Block login if email not verified
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            log.warn("Login attempt on unverified account: email={}", email);
            throw new UnprocessableEntityException(
                    "Veuillez vérifier votre adresse email avant de vous connecter.");
        }

        // 2FA branch
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
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getFirstName());
        log.info("User logged in successfully: email={}", user.getEmail());

        return TwoFactorResponse.builder()
                .requiresTwoFactor(false)
                .userId(null)
                .token(token)
                .build();
    }
}
