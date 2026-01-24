package com.backend.service;

import com.backend.entity.Room;

import java.util.List;

public interface RoomService {

    Room addRoom(Long ownerId, Room room);

    Room updateRoom(Long roomId, Room room);

    void deleteRoom(Long roomId);

    Room getRoomById(Long roomId);

    List<Room> getRoomsByOwner(Long ownerId);

    List<Room> getAvailableRooms();

    List<Room> getAvailableRoomsByOwner(Long ownerId);

    List<Room> getRoomsByPriceRange(Double min, Double max);
}
