package com.layerlab.backend.dto.response;

import com.layerlab.backend.entity.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String email;
    private Role role;
}
