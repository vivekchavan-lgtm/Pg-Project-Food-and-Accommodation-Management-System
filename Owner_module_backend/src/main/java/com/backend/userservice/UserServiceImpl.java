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
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
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

        try {
            // Create User
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

            // If OWNER → create Owner profile and link BEFORE save
            if (user.getRole() == Role.OWNER) {
                System.out.println("DEBUG: Preparing Owner profile...");
                Owner owner;

                if (request.getOwnerType() == com.backend.ownerentity.OwnerType.PG) {
                    com.backend.ownerentity.PGOwner pgOwner = new com.backend.ownerentity.PGOwner();
                    pgOwner.setPgName("PG Name Not Set"); 
                    pgOwner.setTotalRooms(1);
                    pgOwner.setPgType(com.backend.ownerentity.PgType.BOTH);
                    pgOwner.setFacilities("Not Set");
                    owner = pgOwner;
                } else {
                    com.backend.ownerentity.MessOwner messOwner = new com.backend.ownerentity.MessOwner();
                    messOwner.setMessName("Mess Name Not Set");
                    messOwner.setMessType(com.backend.ownerentity.MessType.BOTH);
                    messOwner.setTimings(com.backend.ownerentity.Timing.FULLDAY);
                    messOwner.setDescription("Not Set");
                    owner = messOwner;
                }

                owner.setOwnerType(request.getOwnerType());
                owner.setName(user.getFirstName() + " " + user.getLastName());
                owner.setContactNo(user.getMobile());
                owner.setEmail(user.getEmail());
                owner.setAddress(user.getCity()); 
                owner.setStatus(com.backend.ownerentity.OwnerStatus.PENDING);
                owner.setIdCardType(com.backend.ownerentity.IdCardType.AADHAR); 
                // ID is null here, so use Mobile for uniqueness
                owner.setIdCardNumber("NOT_PROV_" + user.getMobile()); 
                
                // Bidirectional Link
                owner.setUser(user);
                user.setOwner(owner);
            }

            System.out.println("DEBUG: Saving User (and cascading Owner)...");
            User savedUser = userRepository.save(user);
            System.out.println("DEBUG: Registration successful. User ID: " + savedUser.getId());
            
            return savedUser;
            
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("DEBUG: Registration Error: " + e.getMessage());
            throw e; 
        }
    }

    // ---------------- LOGIN ----------------

    @Override
    public User authenticate(LoginRequest request) {

        System.out.println("DEBUG: Authenticating email: " + request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.err.println("DEBUG: User not found for email: " + request.getEmail());
                    return new RuntimeException("Invalid email/password");
                });

        System.out.println("DEBUG: User found. ID: " + user.getId() + ", Stored Hash: " + user.getPassword());
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("DEBUG: Password match result: " + matches);

        if (!matches) {
            System.err.println("DEBUG: Password mismatch!");
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

    @Override
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        if (userDetails.getFirstName() != null) user.setFirstName(userDetails.getFirstName());
        if (userDetails.getLastName() != null) user.setLastName(userDetails.getLastName());
        if (userDetails.getMobile() != null) user.setMobile(userDetails.getMobile());
        if (userDetails.getCity() != null) user.setCity(userDetails.getCity());
        if (userDetails.getGender() != null) user.setGender(userDetails.getGender());

        // Update Owner details if linked
        if (user.getOwner() != null) {
            user.getOwner().setName(user.getFirstName() + " " + user.getLastName());
            user.getOwner().setContactNo(user.getMobile());
            user.getOwner().setAddress(user.getCity());
        }

        return userRepository.save(user);
    }

    @Override
    public void changePassword(Long id, String oldPassword, String newPassword) {
        User user = getUserById(id);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
