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

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userService.authenticate(request);

        LoginResponse response = new LoginResponse();
        response.setUserId(user.getId());
        response.setRole(user.getRole().name());

        Owner owner = user.getOwner();
        if (owner != null) {
            response.setOwnerType(owner.getOwnerType().name());
        }

        response.setToken("dummy-jwt-token");

        return response;
    }

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {

        User savedUser = userService.registerUser(request);

        RegisterResponse response = new RegisterResponse();
        response.setUserId(savedUser.getId());
        response.setRole(savedUser.getRole().name());

        if (savedUser.getOwner() != null) {
            response.setOwnerType(savedUser.getOwner().getOwnerType().name());
        }

        return response;
    }
}
