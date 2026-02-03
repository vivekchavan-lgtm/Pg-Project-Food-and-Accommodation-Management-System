package com.backend.usercontoller;

import com.backend.auth.dto.*;
import com.backend.ownerentity.Owner;
import com.backend.userentity.User;
import com.backend.userservice.UserService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final com.backend.config.JwtUtil jwtUtil;

    public AuthController(UserService userService, com.backend.config.JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userService.authenticate(request);

        LoginResponse response = new LoginResponse();
        response.setUserId(user.getId());
        response.setRole(user.getRole().name());
        response.setName(user.getFirstName() + " " + user.getLastName());

        Owner owner = user.getOwner();
        if (owner != null) {
            response.setOwnerType(owner.getOwnerType().name());
        }

        // GENERATE REAL JWT
        java.util.Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("role", user.getRole().name());
        if (owner != null) {
            claims.put("ownerType", owner.getOwnerType().name());
        }
        claims.put("userId", user.getId());

        String token = jwtUtil.generateToken(user.getEmail(), claims);
        response.setToken(token);

        System.out.println("DEBUG: Generated JWT for user: " + user.getEmail());

        return response;
    }

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {

        User savedUser = userService.registerUser(request);

        RegisterResponse response = new RegisterResponse();
        response.setUserId(savedUser.getId());
        response.setRole(savedUser.getRole().name());
        response.setName(savedUser.getFirstName() + " " + savedUser.getLastName());

        if (savedUser.getOwner() != null) {
            response.setOwnerType(savedUser.getOwner().getOwnerType().name());
        }

        return response;
    }
}
