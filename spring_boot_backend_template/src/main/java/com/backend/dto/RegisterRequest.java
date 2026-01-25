package com.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String mobileNo;
    private String gender;
    private String city;
}
