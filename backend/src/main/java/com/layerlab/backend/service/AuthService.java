package com.layerlab.backend.service;

import com.layerlab.backend.dto.request.LoginRequest;
import com.layerlab.backend.dto.request.RegisterRequest;
import com.layerlab.backend.dto.response.TwoFactorResponse;

/**
 * Service interface for authentication operations.
 *
 * <p>Covers user registration and login, including the 2FA challenge flow.
 *
 * <p>Requirements: 1.1, 1.2, 1.3, 1.4, 1.8, 16.4
 */
public interface AuthService {

    /**
     * Registers a new user account.
     *
     * <p>Validates email uniqueness, hashes the password with BCrypt, persists the user
     * with {@code ROLE_USER}, and returns a JWT token.
     *
     * @param request the registration payload (firstName, lastName, email, password, phone, address)
     * @return a {@link TwoFactorResponse} with {@code requiresTwoFactor=false} and the JWT token
     * @throws com.layerlab.backend.exception.ConflictException if the email is already registered
     */
    TwoFactorResponse register(RegisterRequest request);

    /**
     * Authenticates an existing user.
     *
     * <ul>
     *   <li>If 2FA is <em>disabled</em>: validates credentials and returns a JWT token directly.</li>
     *   <li>If 2FA is <em>enabled</em>: validates credentials, generates and emails an OTP,
     *       and returns a 2FA challenge ({@code requiresTwoFactor=true}, {@code userId} set,
     *       {@code token=null}).</li>
     * </ul>
     *
     * @param request the login payload (email, password)
     * @return a {@link TwoFactorResponse} — either a direct JWT or a 2FA challenge
     * @throws org.springframework.security.authentication.BadCredentialsException if credentials
     *         are incorrect
     */
    TwoFactorResponse login(LoginRequest request);
}
