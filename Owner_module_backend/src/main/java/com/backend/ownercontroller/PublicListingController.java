package com.backend.ownercontroller;

import com.backend.ownerentity.MessMenu;
import com.backend.ownerentity.Owner;
import com.backend.ownerentity.OwnerStatus;
import com.backend.ownerentity.OwnerType;
import com.backend.ownerentity.Room;
import com.backend.ownerservice.MessMenuService;
import com.backend.ownerservice.OwnerService;
import com.backend.ownerservice.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/listings")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicListingController {

    private final OwnerService ownerService;
    private final RoomService roomService;
    private final MessMenuService menuService;

    public PublicListingController(OwnerService ownerService, 
                                   RoomService roomService, 
                                   MessMenuService menuService) {
        this.ownerService = ownerService;
        this.roomService = roomService;
        this.menuService = menuService;
    }

    // Get all active listings
    @GetMapping
    public ResponseEntity<List<com.backend.dtos.PublicListingDto>> getAllActiveListings() {
        try {
            List<com.backend.dtos.PublicListingDto> dtos = ownerService.getOwnersByStatus(com.backend.ownerentity.OwnerStatus.ACTIVE).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("ERROR in getAllActiveListings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get active PGs
    @GetMapping("/pg")
    public ResponseEntity<List<com.backend.dtos.PublicListingDto>> getActivePGs() {
        try {
            List<com.backend.dtos.PublicListingDto> dtos = ownerService.getOwnersByTypeAndStatus(OwnerType.PG, OwnerStatus.ACTIVE).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("ERROR in getActivePGs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get active Messes
    @GetMapping("/mess")
    public ResponseEntity<List<com.backend.dtos.PublicListingDto>> getActiveMesses() {
        try {
            List<com.backend.dtos.PublicListingDto> dtos = ownerService.getOwnersByTypeAndStatus(OwnerType.MESS, OwnerStatus.ACTIVE).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("ERROR in getActiveMesses: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get details of a single listing (Owner + Rooms/Menu)
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getListingDetails(@PathVariable Long id) {
        try {
            Owner owner = ownerService.getOwnerById(id);
            if (owner.getStatus() != OwnerStatus.ACTIVE) {
                return ResponseEntity.status(403).build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("owner", mapToDto(owner));

            if (owner.getOwnerType() == OwnerType.PG) {
                // Use getRoomsByOwnerId since we have the ownerId directly
                List<Room> rooms = roomService.getRoomsByOwnerId(id);
                response.put("rooms", rooms);
            } else {
                // Use getMenuByOwnerId since we have the ownerId directly
                List<MessMenu> menu = menuService.getMenuByOwnerId(id);
                response.put("menu", menu);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("ERROR in getListingDetails for id " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper to avoid Infinite Recursion and Lazy Load issues
    private com.backend.dtos.PublicListingDto mapToDto(Owner owner) {
        com.backend.dtos.PublicListingDto dto = new com.backend.dtos.PublicListingDto();
        dto.setOwnerId(owner.getOwnerId());
        dto.setName(owner.getName());
        dto.setEmail(owner.getEmail());
        dto.setContactNo(owner.getContactNo());
        dto.setAddress(owner.getAddress());
        dto.setOwnerType(owner.getOwnerType().name());
        dto.setStatus(owner.getStatus().name());

        if (owner instanceof com.backend.ownerentity.PGOwner) {
            com.backend.ownerentity.PGOwner pg = (com.backend.ownerentity.PGOwner) owner;
            dto.setPgName(pg.getPgName());
            dto.setPgType(pg.getPgType() != null ? pg.getPgType().name() : "BOTH");
            dto.setFacilities(pg.getFacilities());
            dto.setImageUrl(pg.getImageUrl());
        } else if (owner instanceof com.backend.ownerentity.MessOwner) {
            com.backend.ownerentity.MessOwner mess = (com.backend.ownerentity.MessOwner) owner;
            dto.setMessName(mess.getMessName());
            dto.setMessType(mess.getMessType() != null ? mess.getMessType().name() : "BOTH");
            dto.setTimings(mess.getTimings() != null ? mess.getTimings().name() : "FULLDAY");
            dto.setDescription(mess.getDescription());
            dto.setImageUrl(mess.getImageUrl());
        }
        return dto;
    }
}
