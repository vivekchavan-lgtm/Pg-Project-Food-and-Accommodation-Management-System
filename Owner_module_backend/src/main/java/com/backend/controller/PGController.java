package com.backend.controller;

import com.backend.entity.PGOwner;
import com.backend.service.PGService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/pg")
public class PGController {

    private final PGService pgService;

    public PGController(PGService pgService) {
        this.pgService = pgService;
    }

    // Create PG owner profile
    @PostMapping
    public ResponseEntity<PGOwner> createPG(@RequestBody PGOwner pgOwner) {
        return ResponseEntity.ok(pgService.createPGOwner(pgOwner));
    }

    // Update PG details
    @PutMapping("/{id}")
    public ResponseEntity<PGOwner> updatePG(
            @PathVariable Long id,
            @RequestBody PGOwner pgOwner) {

        return ResponseEntity.ok(pgService.updatePGDetails(id, pgOwner));
    }

    // Get PG owner by ID
    @GetMapping("/{id}")
    public ResponseEntity<PGOwner> getPG(@PathVariable Long id) {
        return ResponseEntity.ok(pgService.getPGOwner(id));
    }

    // List all PG owners
    @GetMapping
    public ResponseEntity<List<PGOwner>> getAllPG() {
        return ResponseEntity.ok(pgService.getAllPGOwners());
    }
}
