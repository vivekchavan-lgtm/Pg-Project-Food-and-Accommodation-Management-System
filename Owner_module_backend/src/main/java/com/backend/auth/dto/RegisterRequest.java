package com.backend.auth.dto;

import com.backend.userentity.Role;
import com.backend.ownerentity.OwnerType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String email;

    private String password;

    private Role role;

    // Only required when role == OWNER
    private OwnerType ownerType;
}

