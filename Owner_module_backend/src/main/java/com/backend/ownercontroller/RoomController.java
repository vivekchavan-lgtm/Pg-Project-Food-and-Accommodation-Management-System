package com.backend.ownercontroller;

import com.backend.ownerentity.Room;
import com.backend.ownerservice.RoomService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // ---------------- PG OWNER APIs ----------------

    // Add new room for PG owner
    @PostMapping("/owner/{ownerId}")
    public ResponseEntity<Room> addRoom(
            @PathVariable Long ownerId,
            @RequestBody Room room) {

        return ResponseEntity.ok(roomService.addRoom(ownerId, room));
    }

    // Update room
    @PutMapping("/{roomId}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long roomId,
            @RequestBody Room room) {

        return ResponseEntity.ok(roomService.updateRoom(roomId, room));
    }

    // Delete room
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {

        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    // ---------------- COMMON / USER APIs ----------------

    // Get room by ID
    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoom(@PathVariable Long roomId) {

        return ResponseEntity.ok(roomService.getRoomById(roomId));
    }

    // Get all rooms of a PG owner (Dashboard uses USER ID)
    @GetMapping("/owner/{userId}")
    public ResponseEntity<List<Room>> getRoomsByOwner(@PathVariable Long userId) {
        System.out.println("DEBUG: Fetching Rooms for Owner associated with UserId: " + userId);
        return ResponseEntity.ok(roomService.getRoomsByOwnerByUserId(userId));
    }

    // Get all available rooms
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {

        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    // Get available rooms for specific PG owner
    @GetMapping("/available/owner/{ownerId}")
    public ResponseEntity<List<Room>> getAvailableRoomsByOwner(
            @PathVariable Long ownerId) {

        return ResponseEntity.ok(roomService.getAvailableRoomsByOwner(ownerId));
    }

    // Filter rooms by price range
    @GetMapping("/price")
    public ResponseEntity<List<Room>> getRoomsByPriceRange(
            @RequestParam Double min,
            @RequestParam Double max) {

        return ResponseEntity.ok(roomService.getRoomsByPriceRange(min, max));
    }
}
 