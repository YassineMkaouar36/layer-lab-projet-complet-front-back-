package com.layerlab.backend.security;

import net.jqwik.api.*;
import net.jqwik.api.constraints.AlphaChars;
import net.jqwik.api.constraints.StringLength;
import org.junit.jupiter.api.Tag;

import java.lang.reflect.Field;

/**
 * Property-based tests for JWT token validity.
 *
 * Validates: Requirement 1.2
 */
@Tag("Feature: layerlab-backend, Property 2: Validité et expiration du token JWT")
class JwtPropertyTest {

    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long EXPIRATION_MS = 86400000L; // 24h

    /**
     * Creates a JwtUtil instance with the given expirationMs via reflection.
     */
    private JwtUtil createJwtUtil(long expirationMs) throws Exception {
        JwtUtil jwtUtil = new JwtUtil();

        Field secretField = JwtUtil.class.getDeclaredField("secret");
        secretField.setAccessible(true);
        secretField.set(jwtUtil, SECRET);

        Field expirationField = JwtUtil.class.getDeclaredField("expirationMs");
        expirationField.setAccessible(true);
        expirationField.set(jwtUtil, expirationMs);

        return jwtUtil;
    }

    /**
     * Property A — Immediate validity:
     * For any non-blank email, a freshly generated token must be valid immediately
     * and extractUsername must return the original email.
     *
     * Validates: Requirement 1.2
     */
    @Property(tries = 100)
    void tokenIsValidImmediatelyAfterCreation(
            @ForAll @AlphaChars @StringLength(min = 1, max = 20) String localPart
    ) throws Exception {
        String email = localPart + "@test.com";
        JwtUtil jwtUtil = createJwtUtil(EXPIRATION_MS);

        String token = jwtUtil.generateToken(email);

        assert jwtUtil.validateToken(token) : "Token should be valid immediately after creation for email: " + email;
        assert email.equals(jwtUtil.extractUsername(token)) : "extractUsername should return the original email";
    }

    /**
     * Property B — Post-expiry invalidity:
     * For any non-blank email, a token generated with 1ms expiry must be invalid
     * after sleeping 5ms (validateToken returns false).
     *
     * Validates: Requirement 1.2
     */
    @Property(tries = 100)
    void tokenIsInvalidAfterExpiry(
            @ForAll @AlphaChars @StringLength(min = 1, max = 20) String localPart
    ) throws Exception {
        String email = localPart + "@test.com";
        JwtUtil jwtUtil = createJwtUtil(1L); // 1ms expiry

        String token = jwtUtil.generateToken(email);

        Thread.sleep(10); // wait for token to expire

        // validateToken catches ExpiredJwtException internally and returns false
        assert !jwtUtil.validateToken(token) : "validateToken should return false for expired token for email: " + email;
    }
}
