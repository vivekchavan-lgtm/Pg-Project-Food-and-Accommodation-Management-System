package com.backend.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long userId;

    private String role;
    private String name;

    private String ownerType; // PG / MESS (null for USER)

    private String token;
}
