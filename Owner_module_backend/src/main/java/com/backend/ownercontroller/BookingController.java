package com.backend.ownercontroller;

import com.backend.dtos.BookingRequestDto;
import com.backend.ownerentity.Booking;
import com.backend.ownerservice.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDto request) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing the booking.");
        }
    }

    // Note: The frontend sends the USER ID in this URL: /api/bookings/owner/{userId}
    @GetMapping("/owner/{userId}")
    public ResponseEntity<?> getBookingsForOwner(@PathVariable Long userId) {
        System.out.println("DEBUG: Fetching bookings for Owner associated with UserId: " + userId);
        try {
            return ResponseEntity.ok(bookingService.getBookingsForOwnerByUserId(userId));
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR in getBookingsForOwner: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching bookings: " + e.getMessage());
        }
    }

    // New Endpoint for direct Owner ID lookup (optional but good for consistency)
    @GetMapping("/owner-direct/{ownerId}")
    public ResponseEntity<?> getBookingsByOwnerId(@PathVariable Long ownerId) {
        System.out.println("DEBUG: Fetching bookings for OwnerId: " + ownerId);
        return ResponseEntity.ok(bookingService.getBookingsForOwnerId(ownerId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsForUser(userId));
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long bookingId, @RequestParam String status) {
        try {
            return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
