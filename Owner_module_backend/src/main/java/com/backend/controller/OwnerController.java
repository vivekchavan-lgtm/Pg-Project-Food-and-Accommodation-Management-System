package com.backend.controller;

import com.backend.entity.Owner;
import com.backend.entity.*;
import com.backend.service.OwnerService;

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

    // Update owner status
    @PutMapping("/{id}/status")
    public ResponseEntity<Owner> updateStatus(
            @PathVariable Long id,
            @RequestParam OwnerStatus status) {

        return ResponseEntity.ok(ownerService.updateOwnerStatus(id, status));
    }

    // Delete owner
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long id) {
        ownerService.deleteOwner(id);
        return ResponseEntity.noContent().build();
    }
}
