package com.layerlab.backend.security;

import com.layerlab.backend.entity.Role;
import com.layerlab.backend.entity.User;
import com.layerlab.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setPassword("encodedPassword123");
        testUser.setPhone("+33612345678");
        testUser.setAddress("123 Rue de Paris");
        testUser.setRole(Role.ROLE_USER);
        testUser.setActive(true);
        testUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void loadUserByUsername_WithValidEmail_ShouldReturnUserDetails() {
        // Given
        when(userRepository.findByEmail(testUser.getEmail()))
                .thenReturn(Optional.of(testUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(testUser.getEmail());

        // Then
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(testUser.getEmail());
        assertThat(userDetails.getPassword()).isEqualTo(testUser.getPassword());
        assertThat(userDetails.getAuthorities())
                .hasSize(1)
                .extracting("authority")
                .containsExactly("ROLE_USER");
        
        verify(userRepository).findByEmail(testUser.getEmail());
    }

    @Test
    void loadUserByUsername_WithAdminRole_ShouldReturnUserDetailsWithAdminAuthority() {
        // Given
        testUser.setRole(Role.ROLE_ADMIN);
        when(userRepository.findByEmail(testUser.getEmail()))
                .thenReturn(Optional.of(testUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(testUser.getEmail());

        // Then
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getAuthorities())
                .hasSize(1)
                .extracting("authority")
                .containsExactly("ROLE_ADMIN");
        
        verify(userRepository).findByEmail(testUser.getEmail());
    }

    @Test
    void loadUserByUsername_WithNonExistentEmail_ShouldThrowUsernameNotFoundException() {
        // Given
        String nonExistentEmail = "nonexistent@example.com";
        when(userRepository.findByEmail(nonExistentEmail))
                .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userDetailsService.loadUserByUsername(nonExistentEmail))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Utilisateur non trouvé avec l'email : " + nonExistentEmail);
        
        verify(userRepository).findByEmail(nonExistentEmail);
    }

    @Test
    void loadUserByUsername_WithEmptyEmail_ShouldThrowUsernameNotFoundException() {
        // Given
        String emptyEmail = "";
        when(userRepository.findByEmail(emptyEmail))
                .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userDetailsService.loadUserByUsername(emptyEmail))
                .isInstanceOf(UsernameNotFoundException.class);
        
        verify(userRepository).findByEmail(emptyEmail);
    }

    @Test
    void loadUserByUsername_WithDifferentEmailCasing_ShouldQueryRepositoryAsProvided() {
        // Given
        String upperCaseEmail = "JOHN.DOE@EXAMPLE.COM";
        User upperCaseUser = new User();
        upperCaseUser.setId(1L);
        upperCaseUser.setFirstName("John");
        upperCaseUser.setLastName("Doe");
        upperCaseUser.setEmail(upperCaseEmail);
        upperCaseUser.setPassword("encodedPassword123");
        upperCaseUser.setRole(Role.ROLE_USER);
        upperCaseUser.setActive(true);
        
        when(userRepository.findByEmail(upperCaseEmail))
                .thenReturn(Optional.of(upperCaseUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(upperCaseEmail);

        // Then
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(upperCaseEmail);
        
        verify(userRepository).findByEmail(upperCaseEmail);
    }
}
