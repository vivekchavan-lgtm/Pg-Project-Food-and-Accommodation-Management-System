package com.backend.ownercontroller;

import com.backend.ownerentity.Owner;
import com.backend.ownerentity.OwnerStatus;
import com.backend.ownerentity.OwnerType;
import com.backend.ownerservice.OwnerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/owners")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    // Get all owners
    @GetMapping
    public ResponseEntity<List<Owner>> getAllOwners() {
        return ResponseEntity.ok(ownerService.getAllOwners());
    }

    // Filter owners by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Owner>> getByType(@PathVariable OwnerType type) {
        return ResponseEntity.ok(ownerService.getOwnersByType(type));
    }

    // Filter by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Owner>> getByStatus(@PathVariable OwnerStatus status) {
        return ResponseEntity.ok(ownerService.getOwnersByStatus(status));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Owner>> getPendingOwners() {
        return ResponseEntity.ok(ownerService.getOwnersByStatus(OwnerStatus.PENDING));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Void> approveOwner(@PathVariable Long id) {
        ownerService.updateOwnerStatus(id, OwnerStatus.ACTIVE);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectOwner(@PathVariable Long id) {
        ownerService.updateOwnerStatus(id, OwnerStatus.INACTIVE);
        return ResponseEntity.ok().build();
    }

    // Update owner status
    @PutMapping("/{id}/status")
    public ResponseEntity<Owner> updateStatus(
            @PathVariable Long id,
            @RequestParam OwnerStatus status) {

        return ResponseEntity.ok(ownerService.updateOwnerStatus(id, status));
    }

    // Update owner profile (Called by Owner to complete their profile)
    @PutMapping("/{id}/profile")
    public ResponseEntity<Owner> updateProfile(
            @PathVariable Long id,
            @RequestBody com.backend.dtos.OwnerProfileUpdateDto dto) {
        
        return ResponseEntity.ok(ownerService.updateOwnerProfile(id, dto));
    }

    // Get owner by ID
    @GetMapping("/{id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long id) {
        return ResponseEntity.ok(ownerService.getOwnerById(id));
    }

    // Delete owner
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long id) {
        ownerService.deleteOwner(id);
        return ResponseEntity.noContent().build();
    }
}
