package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String name;
    private String email;
    private String mobileNo;
    private String gender;
    private String city;
    private String role;
}
