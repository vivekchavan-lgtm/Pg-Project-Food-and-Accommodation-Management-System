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

    @Override
    public User registerUser(RegisterRequest request) {

    	  if (request.getRole() == Role.ADMIN) {
    	        throw new RuntimeException("Admin registration is not allowed");
    	    }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.OWNER) {

            Owner owner = new Owner();
            owner.setUser(savedUser);
            owner.setOwnerType(request.getOwnerType());

            ownerRepository.save(owner);
        }

        return savedUser;
    }

    @Override
    public User authenticate(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email/password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email/password");
        }

        return user;
    }

    @Override
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
