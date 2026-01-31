package com.backend.ownercontroller;

import com.backend.ownerentity.OwnerStatus;
import com.backend.ownerrepos.OwnerRepository;
import com.backend.userrepos.UserRepository;
import com.backend.userentity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;

    public AdminController(UserRepository userRepository, OwnerRepository ownerRepository) {
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
    }

    // Get Admin Stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOwners", ownerRepository.count());
        stats.put("pendingApprovals", ownerRepository.findByStatus(OwnerStatus.PENDING).size());
        stats.put("activeBookings", 0); // Placeholder
        return ResponseEntity.ok(stats);
    }

    // Manage Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
