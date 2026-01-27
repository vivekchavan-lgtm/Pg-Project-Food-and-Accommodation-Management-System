package pg.login.service.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pg.login.service.dto.LoginRequest;
import pg.login.service.dto.LoginResponse;
import pg.login.service.dto.RegisterRequest;
import pg.login.service.dto.RegisterResponse;
import pg.login.service.service.AuthService;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request received for email: {}", request);
        RegisterResponse response = authService.register(request);
        log.info("User registered successfully: {}", request.getEmail());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for username: {}", request.getUsername());
        LoginResponse response = authService.login(request);
        log.info("Login successful for username: {}", request.getUsername());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
