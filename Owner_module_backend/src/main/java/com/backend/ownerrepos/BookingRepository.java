package com.backend.ownerrepos;

import com.backend.ownerentity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Get bookings for an owner (to display in dashboard)
    List<Booking> findByOwner_OwnerIdOrderByCreatedAtDesc(Long ownerId);

    // Get bookings for a user (to display in user profile)
    List<Booking> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    // Check if user already booked
    boolean existsByUser_IdAndOwner_OwnerId(Long userId, Long ownerId);

    // Validate for Rating (Must exist and be ACCEPTED)
    boolean existsByUser_IdAndOwner_OwnerIdAndStatus(Long userId, Long ownerId, com.backend.ownerentity.BookingStatus status);
}
