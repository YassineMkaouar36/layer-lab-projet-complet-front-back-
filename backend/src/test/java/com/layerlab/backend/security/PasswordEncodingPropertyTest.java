package com.layerlab.backend.security;

import net.jqwik.api.*;
import net.jqwik.api.constraints.AlphaChars;
import net.jqwik.api.constraints.StringLength;
import org.junit.jupiter.api.Tag;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Property-based tests for BCrypt password encoding.
 *
 * Validates: Requirement 1.8
 */
@Tag("Feature: layerlab-backend, Property 1: Chiffrement des mots de passe")
class PasswordEncodingPropertyTest {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * Property A — Hash differs from plaintext:
     * For any password of at least 8 characters, the BCrypt hash must never
     * equal the original plaintext password.
     *
     * Validates: Requirement 1.8
     */
    @Property(tries = 100)
    void encodedPasswordDiffersFromPlaintext(
            @ForAll @AlphaChars @StringLength(min = 8, max = 64) String password
    ) {
        String hash = encoder.encode(password);

        assert !hash.equals(password)
                : "BCrypt hash must not equal the plaintext password: " + password;
    }

    /**
     * Property B — Hash is verifiable via matches():
     * For any password of at least 8 characters, BCryptPasswordEncoder.matches()
     * must return true when comparing the plaintext against its own hash.
     *
     * Validates: Requirement 1.8
     */
    @Property(tries = 100)
    void encodedPasswordMatchesOriginal(
            @ForAll @AlphaChars @StringLength(min = 8, max = 64) String password
    ) {
        String hash = encoder.encode(password);

        assert encoder.matches(password, hash)
                : "BCryptPasswordEncoder.matches() must return true for the original password against its hash";
    }

    /**
     * Property C — Two hashes of the same password are distinct (salting):
     * For any password of at least 8 characters, encoding it twice must produce
     * two different hashes (BCrypt uses a random salt per encoding).
     * Both hashes must still match the original password via matches().
     *
     * Validates: Requirement 1.8
     */
    @Property(tries = 100)
    void twoHashesOfSamePasswordAreDistinct(
            @ForAll @AlphaChars @StringLength(min = 8, max = 64) String password
    ) {
        String hash1 = encoder.encode(password);
        String hash2 = encoder.encode(password);

        assert !hash1.equals(hash2)
                : "Two BCrypt hashes of the same password must differ due to random salting";
        assert encoder.matches(password, hash1)
                : "First hash must still match the original password";
        assert encoder.matches(password, hash2)
                : "Second hash must still match the original password";
    }

    /**
     * Property D — Wrong password does not match:
     * For any two distinct passwords of at least 8 characters, the hash of the
     * first must not match the second via matches().
     *
     * Validates: Requirement 1.8
     */
    @Property(tries = 100)
    void wrongPasswordDoesNotMatch(
            @ForAll @AlphaChars @StringLength(min = 8, max = 32) String password,
            @ForAll @AlphaChars @StringLength(min = 8, max = 32) String otherPassword
    ) {
        Assume.that(!password.equals(otherPassword));

        String hash = encoder.encode(password);

        assert !encoder.matches(otherPassword, hash)
                : "BCryptPasswordEncoder.matches() must return false for a different password against the hash";
    }
}
