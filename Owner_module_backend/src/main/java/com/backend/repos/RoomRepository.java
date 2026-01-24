package com.backend.repos;

import com.backend.entity.Room;
import com.backend.entity.PGOwner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Get all rooms of a specific PG owner
    List<Room> findByPgOwner(PGOwner pgOwner);

    // Get all available rooms
    List<Room> findByAvailabilityTrue();

    // Get rooms by PG owner ID
    List<Room> findByPgOwnerOwnerId(Long ownerId);

    // Filter rooms by price range
    List<Room> findByPriceBetween(Double minPrice, Double maxPrice);

    // Get available rooms for a PG owner
    List<Room> findByPgOwnerOwnerIdAndAvailabilityTrue(Long ownerId);
}
