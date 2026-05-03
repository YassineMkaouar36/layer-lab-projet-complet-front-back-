package com.layerlab.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service responsible for sending transactional emails.
 *
 * <p>Currently used to deliver OTP codes for Two-Factor Authentication (2FA).
 *
 * <p>Requirement: 16.4
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@layerlab.tn}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends an email verification link to a newly registered user.
     *
     * @param to    the recipient's email address
     * @param token the unique verification token
     * @param verificationUrl the full clickable URL
     */
    public void sendVerificationEmail(String to, String verificationUrl) {
        log.info("Sending verification email to {}", to);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject("LayerLab — Confirmez votre adresse email");
        message.setText(buildVerificationEmailBody(verificationUrl));

        try {
            mailSender.send(message);
            log.info("Verification email sent successfully to {}", to);
        } catch (MailException e) {
            log.error("Failed to send verification email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Impossible d'envoyer l'email de vérification à : " + to, e);
        }
    }

    /**
     * Sends a 6-digit OTP code to the specified email address.
     *
     * <p>The email contains a plain-text message with the OTP and its 10-minute validity window.
     *
     * @param to      the recipient's email address
     * @param otpCode the 6-digit OTP code to include in the email
     * @throws RuntimeException if the email could not be delivered (wrapped {@link MailException})
     */
    public void sendOtpEmail(String to, String otpCode) {
        log.info("Sending OTP email to {}", to);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject("LayerLab — Votre code de vérification");
        message.setText(buildOtpEmailBody(otpCode));

        try {
            mailSender.send(message);
            log.info("OTP email sent successfully to {}", to);
        } catch (MailException e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Impossible d'envoyer l'email OTP à : " + to, e);
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private String buildVerificationEmailBody(String verificationUrl) {
        return """
                Bonjour,

                Merci de vous être inscrit sur LayerLab !

                Veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :

                    %s

                Ce lien est valable pendant 24 heures.

                Si vous n'avez pas créé de compte, ignorez cet email.

                — L'équipe LayerLab
                """.formatted(verificationUrl);
    }

    private String buildOtpEmailBody(String otpCode) {
        return """
                Bonjour,

                Votre code de vérification LayerLab est :

                    %s

                Ce code est valable pendant 10 minutes et ne peut être utilisé qu'une seule fois.

                Si vous n'avez pas demandé ce code, ignorez cet email.

                — L'équipe LayerLab
                """.formatted(otpCode);
    }
}
