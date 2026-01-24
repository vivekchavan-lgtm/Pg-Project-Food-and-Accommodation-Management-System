package com.backend.controller;

import com.backend.entity.MessOwner;
import com.backend.service.MessService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/mess")
public class MessController {

    private final MessService messService;

    public MessController(MessService messService) {
        this.messService = messService;
    }

    // Create Mess owner profile
    @PostMapping
    public ResponseEntity<MessOwner> createMess(@RequestBody MessOwner messOwner) {
        return ResponseEntity.ok(messService.createMessOwner(messOwner));
    }

    // Update Mess details
    @PutMapping("/{id}")
    public ResponseEntity<MessOwner> updateMess(
            @PathVariable Long id,
            @RequestBody MessOwner messOwner) {

        return ResponseEntity.ok(messService.updateMessDetails(id, messOwner));
    }

    // Get Mess owner by ID
    @GetMapping("/{id}")
    public ResponseEntity<MessOwner> getMess(@PathVariable Long id) {
        return ResponseEntity.ok(messService.getMessOwner(id));
    }

    // List all Mess owners
    @GetMapping
    public ResponseEntity<List<MessOwner>> getAllMess() {
        return ResponseEntity.ok(messService.getAllMessOwners());
    }
}
