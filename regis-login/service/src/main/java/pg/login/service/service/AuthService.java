package pg.login.service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pg.login.service.dto.LoginRequest;
import pg.login.service.dto.LoginResponse;
import pg.login.service.dto.RegisterRequest;
import pg.login.service.dto.RegisterResponse;
import pg.login.service.entity.User;
import pg.login.service.exception.UserAlreadyExistsException;
import pg.login.service.exception.InvalidCredentialsException;
import pg.login.service.repository.UserRepository;
import pg.login.service.utils.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public RegisterResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username '" + request.getUsername() + "' is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email '" + request.getEmail() + "' is already registered");
        }

        // Check if mobile number already exists
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new UserAlreadyExistsException("Mobile number '" + request.getMobile() + "' is already registered");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setGender(request.getGender());
        user.setCity(request.getCity());

        userRepository.save(user);

        return new RegisterResponse(
                "User registered successfully",
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getMobile(),
                user.getGender(),
                user.getCity()
        );
    }

    public LoginResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername());

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getMobile(),
                user.getGender(),
                user.getCity()
        );
    }
}
