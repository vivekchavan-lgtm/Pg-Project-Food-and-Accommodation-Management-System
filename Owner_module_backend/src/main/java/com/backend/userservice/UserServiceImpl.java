package com.backend.userservice;

import com.backend.auth.dto.LoginRequest;
import com.backend.auth.dto.RegisterRequest;
import com.backend.ownerentity.Owner;
import com.backend.userentity.Role;
import com.backend.userentity.User;
import com.backend.userrepos.UserRepository;
import com.backend.ownerrepos.OwnerRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           OwnerRepository ownerRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ---------------- REGISTER ----------------

    @Override
    public User registerUser(RegisterRequest request) {

        // ❌ Block admin self registration
        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin registration is not allowed");
        }

        // Duplicate email check
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Owner must specify type
        if (request.getRole() == Role.OWNER && request.getOwnerType() == null) {
            throw new RuntimeException("Owner type must be provided");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCity(request.getCity());
        user.setGender(request.getGender());

        user.setRole(request.getRole());
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        // If OWNER → create Owner profile
        if (savedUser.getRole() == Role.OWNER) {

            Owner owner = new Owner();
            owner.setUser(savedUser);
            owner.setOwnerType(request.getOwnerType());

            ownerRepository.save(owner);
        }

        return savedUser;
    }

    // ---------------- LOGIN ----------------

    @Override
    public User authenticate(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email/password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email/password");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("User account disabled by admin");
        }

        return user;
    }

    // ---------------- FETCH ----------------

    @Override
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
