package com.backend.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private Long userId;

    private String role;
    private String name;

    private String ownerType;
}
