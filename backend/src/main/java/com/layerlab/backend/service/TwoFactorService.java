package com.layerlab.backend.service;

/**
 * Service interface for Two-Factor Authentication (2FA) operations.
 *
 * <p>Handles OTP generation/validation and enabling/disabling 2FA for users.
 *
 * <p>Requirement: 16.4
 */
public interface TwoFactorService {

    /**
     * Enables 2FA for the given user.
     *
     * @param userId the ID of the user
     */
    void enableTwoFactor(Long userId);

    /**
     * Disables 2FA for the given user and clears any pending OTP.
     *
     * @param userId the ID of the user
     */
    void disableTwoFactor(Long userId);

    /**
     * Generates a 6-digit OTP, stores it (hashed) with a 10-minute expiry,
     * and sends it to the user's email address.
     *
     * @param userId the ID of the user
     */
    void generateOtp(Long userId);

    /**
     * Validates the provided OTP code for the given user.
     * The code must not be expired and must match the stored value.
     * On successful validation the OTP is invalidated (single-use).
     *
     * @param userId  the ID of the user
     * @param otpCode the 6-digit code submitted by the user
     * @return the JWT token to be issued after successful 2FA validation
     * @throws com.layerlab.backend.exception.UnprocessableEntityException if the code is
     *         invalid, expired, or already used
     */
    String validateOtp(Long userId, String otpCode);
}
