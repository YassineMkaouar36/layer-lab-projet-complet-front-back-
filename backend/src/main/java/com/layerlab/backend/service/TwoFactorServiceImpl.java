package com.layerlab.backend.service;

import com.layerlab.backend.entity.User;
import com.layerlab.backend.exception.ResourceNotFoundException;
import com.layerlab.backend.exception.UnprocessableEntityException;
import com.layerlab.backend.repository.UserRepository;
import com.layerlab.backend.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * Implementation of {@link TwoFactorService}.
 *
 * <h3>OTP lifecycle</h3>
 * <ol>
 *   <li>{@link #generateOtp(Long)} — creates a 6-digit code, stores it BCrypt-hashed with a
 *       10-minute expiry, and emails it to the user.</li>
 *   <li>{@link #validateOtp(Long, String)} — verifies the code (not expired, matches hash),
 *       clears it (single-use), and returns a fresh JWT token.</li>
 * </ol>
 *
 * <p>Requirement: 16.4
 */
@Service
@Transactional
public class TwoFactorServiceImpl implements TwoFactorService {

    private static final Logger log = LoggerFactory.getLogger(TwoFactorServiceImpl.class);

    /** OTP validity window in minutes. */
    private static final int OTP_VALIDITY_MINUTES = 10;

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom;

    public TwoFactorServiceImpl(UserRepository userRepository,
                                EmailService emailService,
                                JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        // Dedicated encoder for OTP hashing — separate from the auth password encoder bean
        // to avoid circular dependency with SecurityConfig.
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.secureRandom = new SecureRandom();
    }

    // -------------------------------------------------------------------------
    // enableTwoFactor
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     *
     * <p>Sets {@code twoFactorEnabled = true} for the user. Any pending OTP is cleared.
     */
    @Override
    public void enableTwoFactor(Long userId) {
        User user = findUserById(userId);
        user.setTwoFactorEnabled(true);
        clearOtp(user);
        userRepository.save(user);
        log.info("2FA enabled for userId={}", userId);
    }

    // -------------------------------------------------------------------------
    // disableTwoFactor
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     *
     * <p>Sets {@code twoFactorEnabled = false} and clears any pending OTP.
     */
    @Override
    public void disableTwoFactor(Long userId) {
        User user = findUserById(userId);
        user.setTwoFactorEnabled(false);
        clearOtp(user);
        userRepository.save(user);
        log.info("2FA disabled for userId={}", userId);
    }

    // -------------------------------------------------------------------------
    // generateOtp
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     *
     * <p>Generates a cryptographically random 6-digit OTP, stores it BCrypt-hashed with a
     * 10-minute expiry, then sends it to the user's registered email address.
     */
    @Override
    public void generateOtp(Long userId) {
        User user = findUserById(userId);

        String rawOtp = generateSixDigitOtp();
        String hashedOtp = passwordEncoder.encode(rawOtp);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES);

        user.setOtpCode(hashedOtp);
        user.setOtpExpiry(expiry);
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), rawOtp);
        log.info("OTP generated and sent for userId={}", userId);
    }

    // -------------------------------------------------------------------------
    // validateOtp
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     *
     * <p>Validates the submitted OTP against the stored hash. On success the OTP is cleared
     * (single-use guarantee) and a JWT token is returned.
     *
     * @throws UnprocessableEntityException if the OTP is missing, expired, or does not match
     */
    @Override
    public String validateOtp(Long userId, String otpCode) {
        User user = findUserById(userId);

        // Guard: OTP must have been generated
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            log.warn("OTP validation attempted but no OTP found for userId={}", userId);
            throw new UnprocessableEntityException(
                    "Aucun code OTP en attente pour cet utilisateur.");
        }

        // Guard: OTP must not be expired
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            clearOtp(user);
            userRepository.save(user);
            log.warn("Expired OTP submitted for userId={}", userId);
            throw new UnprocessableEntityException(
                    "Le code OTP a expiré. Veuillez en demander un nouveau.");
        }

        // Guard: OTP must match the stored hash
        if (!passwordEncoder.matches(otpCode, user.getOtpCode())) {
            log.warn("Invalid OTP submitted for userId={}", userId);
            throw new UnprocessableEntityException(
                    "Code OTP invalide.");
        }

        // Success — invalidate the OTP (single-use) and issue a JWT
        clearOtp(user);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getFirstName());
        log.info("OTP validated successfully for userId={}, JWT issued", userId);
        return token;
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Loads a {@link User} by ID or throws {@link ResourceNotFoundException}.
     */
    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Utilisateur introuvable avec l'id : " + userId));
    }

    /**
     * Clears the pending OTP fields on the given user (does NOT save — caller must save).
     */
    private void clearOtp(User user) {
        user.setOtpCode(null);
        user.setOtpExpiry(null);
    }

    /**
     * Generates a cryptographically random 6-digit OTP string (zero-padded).
     *
     * @return a string of exactly 6 decimal digits, e.g. {@code "042817"}
     */
    private String generateSixDigitOtp() {
        int code = secureRandom.nextInt(1_000_000); // [0, 999999]
        return String.format("%06d", code);
    }
}
