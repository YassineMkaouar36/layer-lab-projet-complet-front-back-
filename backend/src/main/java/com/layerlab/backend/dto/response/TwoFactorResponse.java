package com.layerlab.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response body for 2FA-related endpoints.
 *
 * <ul>
 *   <li>When 2FA is required after login: {@code requiresTwoFactor=true}, {@code userId} set,
 *       {@code token=null}.</li>
 *   <li>When 2FA is not required (disabled) or after successful OTP validation:
 *       {@code requiresTwoFactor=false}, {@code userId=null}, {@code token} set.</li>
 * </ul>
 *
 * <p>Requirement: 16.4
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TwoFactorResponse {

    /** True when a 2FA challenge has been issued and the JWT has not yet been emitted. */
    private boolean requiresTwoFactor;

    /**
     * The user's ID — populated only when {@code requiresTwoFactor=true} so the client
     * knows which userId to submit with the OTP.
     */
    private Long userId;

    /**
     * The JWT token — populated only after successful authentication (either 2FA disabled,
     * or OTP validated successfully).
     */
    private String token;

    // Explicit constructors — ensure availability regardless of annotation processing
    public TwoFactorResponse(boolean requiresTwoFactor, Long userId, String token) {
        this.requiresTwoFactor = requiresTwoFactor;
        this.userId = userId;
        this.token = token;
    }

    // Explicit accessors — ensure availability regardless of annotation processing
    public boolean isRequiresTwoFactor() { return requiresTwoFactor; }
    public Long getUserId() { return userId; }
    public String getToken() { return token; }
    public void setRequiresTwoFactor(boolean requiresTwoFactor) { this.requiresTwoFactor = requiresTwoFactor; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setToken(String token) { this.token = token; }

    /**
     * Static factory — used instead of Lombok's {@code @Builder} when annotation processing
     * is not available at compile time.
     */
    public static TwoFactorResponseBuilder builder() {
        return new TwoFactorResponseBuilder();
    }

    public static class TwoFactorResponseBuilder {
        private boolean requiresTwoFactor;
        private Long userId;
        private String token;

        public TwoFactorResponseBuilder requiresTwoFactor(boolean requiresTwoFactor) {
            this.requiresTwoFactor = requiresTwoFactor;
            return this;
        }

        public TwoFactorResponseBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public TwoFactorResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public TwoFactorResponse build() {
            return new TwoFactorResponse(requiresTwoFactor, userId, token);
        }
    }
}
