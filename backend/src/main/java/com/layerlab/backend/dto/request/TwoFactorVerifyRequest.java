package com.layerlab.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request body for POST /api/auth/2fa/verify.
 *
 * <p>Requirement: 16.4
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TwoFactorVerifyRequest {

    @NotNull(message = "L'identifiant utilisateur est obligatoire")
    private Long userId;

    @NotBlank(message = "Le code OTP est obligatoire")
    @Pattern(regexp = "\\d{6}", message = "Le code OTP doit être composé de 6 chiffres")
    private String otpCode;

    // Explicit accessors — ensure availability regardless of annotation processing
    public Long getUserId() { return userId; }
    public String getOtpCode() { return otpCode; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
}
