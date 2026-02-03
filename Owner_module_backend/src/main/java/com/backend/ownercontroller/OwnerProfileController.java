package com.backend.ownercontroller;

import com.backend.ownerentity.Owner;
import com.backend.ownerservice.OwnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owners")
public class OwnerProfileController {

    private final OwnerService ownerService;

    public OwnerProfileController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    // Get owner by User ID (Used by Owner Dashboard to get self details)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Owner> getOwnerByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ownerService.getOwnerByUserId(userId));
    }
}
