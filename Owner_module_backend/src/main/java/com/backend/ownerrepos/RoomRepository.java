package com.backend.ownerrepos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.ownerentity.PGOwner;
import com.backend.ownerentity.Room;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Get all rooms of a specific PG owner
    List<Room> findByPgOwner(PGOwner pgOwner);

    // Get all available rooms
    List<Room> findByAvailabilityTrue();

    // Get rooms by PG owner ID
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Room r WHERE r.pgOwner.ownerId = :ownerId")
    List<Room> findByPgOwnerOwnerId(@org.springframework.data.repository.query.Param("ownerId") Long ownerId);

    // Filter rooms by price range
    List<Room> findByPriceBetween(Double minPrice, Double maxPrice);

    // Get available rooms for a PG owner
    List<Room> findByPgOwnerOwnerIdAndAvailabilityTrue(Long ownerId);
}
