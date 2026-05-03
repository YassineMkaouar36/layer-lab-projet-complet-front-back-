package com.layerlab.backend.dto.response;

import com.layerlab.backend.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private Role role;
    private Boolean active;
    private LocalDateTime createdAt;
}
