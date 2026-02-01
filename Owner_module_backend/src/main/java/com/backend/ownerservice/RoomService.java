package com.backend.ownerservice;

import java.util.List;

import com.backend.ownerentity.Room;

public interface RoomService {

    Room addRoom(Long ownerId, Room room);

    Room updateRoom(Long roomId, Room room);

    void deleteRoom(Long roomId);

    Room getRoomById(Long roomId);

    // Explicit lookup by User ID
    List<Room> getRoomsByOwnerByUserId(Long userId);

    // Explicit lookup by Owner ID
    List<Room> getRoomsByOwnerId(Long ownerId);

    List<Room> getAvailableRooms();

    List<Room> getAvailableRoomsByOwner(Long ownerId);

    List<Room> getRoomsByPriceRange(Double min, Double max);
}
