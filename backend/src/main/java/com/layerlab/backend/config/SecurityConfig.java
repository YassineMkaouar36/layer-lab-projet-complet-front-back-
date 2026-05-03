package com.layerlab.backend.config;

import com.layerlab.backend.security.JwtAuthenticationFilter;
import com.layerlab.backend.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration for LayerLab backend.
 *
 * <p>Configures JWT-based stateless authentication, endpoint authorization rules,
 * and exposes required security beans (PasswordEncoder, AuthenticationManager).
 *
 * <p>Requirements: 1.6, 1.7, 1.8
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * BCrypt password encoder bean.
     * Requirement 1.8: passwords must be hashed with BCrypt before persistence.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * JWT authentication filter bean.
     * Validates the Bearer token on every request before the standard
     * UsernamePasswordAuthenticationFilter runs.
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService);
    }

    /**
     * DAO authentication provider wired with our UserDetailsService and password encoder.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Exposes the AuthenticationManager so that AuthController can call
     * authenticate() directly.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Main security filter chain.
     *
     * <ul>
     *   <li>CSRF disabled — stateless REST API using JWT (Requirement 1.6)</li>
     *   <li>Session management set to STATELESS (Requirement 1.6)</li>
     *   <li>Public endpoints: /api/auth/**, /swagger-ui/**, /v3/api-docs/**</li>
     *   <li>/api/admin/** requires ROLE_ADMIN (Requirement 1.7)</li>
     *   <li>All other /api/** endpoints require authentication (Requirement 1.6)</li>
     *   <li>JwtAuthenticationFilter runs before UsernamePasswordAuthenticationFilter</li>
     * </ul>
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — not needed for stateless JWT APIs
            .csrf(AbstractHttpConfigurer::disable)

            // Stateless session — no HTTP session will be created or used
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/api/auth/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/actuator/health"
                ).permitAll()

                // Admin-only endpoints — Requirement 1.7
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // All other API endpoints require authentication — Requirement 1.6
                .requestMatchers("/api/**").authenticated()

                // Any remaining request is permitted (static resources, etc.)
                .anyRequest().permitAll()
            )

            // Wire our DAO authentication provider
            .authenticationProvider(authenticationProvider())

            // Add JWT filter before the standard username/password filter
            .addFilterBefore(jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
