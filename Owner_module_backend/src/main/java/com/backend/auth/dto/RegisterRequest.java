package com.backend.auth.dto;

import com.backend.userentity.Gender;
import com.backend.userentity.Role;
import com.backend.ownerentity.OwnerType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String mobile;
    private String email;
    private String password;
    private String city;
    private Gender gender;

    private Role role;          // USER / OWNER
    private OwnerType ownerType; // only if OWNER
}

