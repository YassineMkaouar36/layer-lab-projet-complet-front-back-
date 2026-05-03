package com.layerlab.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // 2FA fields — Requirement 16.4
    @Column(nullable = false)
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    /**
     * Optional secret used for TOTP-based 2FA (reserved for future use).
     * Currently unused — OTP flow relies on email delivery.
     */
    @Column(nullable = true)
    private String twoFactorSecret;

    /** Nullable: only set when an OTP has been generated and is pending validation. */
    @Column(nullable = true)
    private String otpCode;

    /** Expiry timestamp for the pending OTP (10-minute window). */
    @Column(nullable = true)
    private LocalDateTime otpExpiry;

    // Explicit accessors to ensure compatibility regardless of annotation processing
    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public Role getRole() { return role; }
    public Boolean getActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public String getTwoFactorSecret() { return twoFactorSecret; }
    public String getOtpCode() { return otpCode; }
    public LocalDateTime getOtpExpiry() { return otpExpiry; }

    public void setId(Long id) { this.id = id; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAddress(String address) { this.address = address; }
    public void setRole(Role role) { this.role = role; }
    public void setActive(Boolean active) { this.active = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }
    public void setTwoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
    public void setOtpExpiry(LocalDateTime otpExpiry) { this.otpExpiry = otpExpiry; }
}
