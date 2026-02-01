package com.backend.ownerservice;

import com.backend.ownerentity.PGOwner;
import com.backend.ownerentity.Room;
import com.backend.ownerrepos.*;
import com.backend.ownerservice.RoomService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final PGOwnerRepository pgOwnerRepository;

    public RoomServiceImpl(RoomRepository roomRepository,
                           PGOwnerRepository pgOwnerRepository) {
        this.roomRepository = roomRepository;
        this.pgOwnerRepository = pgOwnerRepository;
    }

    @Override
    public Room addRoom(Long userId, Room room) {
        System.out.println("DEBUG: RoomServiceImpl.addRoom - Searching for owner userId: " + userId);
        PGOwner pgOwner = pgOwnerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("PG Owner not found for userId: " + userId));

        System.out.println("DEBUG: RoomServiceImpl.addRoom - Found owner: " + pgOwner.getEmail());
        room.setPgOwner(pgOwner);

        Room saved = roomRepository.save(room);
        System.out.println("DEBUG: RoomServiceImpl.addRoom - Saved room: " + saved.getRoomNumber());
        return saved;
    }

    @Override
    public Room updateRoom(Long roomId, Room updatedRoom) {

        Room existing = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        existing.setRoomNumber(updatedRoom.getRoomNumber());
        existing.setPrice(updatedRoom.getPrice());
        existing.setCapacity(updatedRoom.getCapacity());
        existing.setAvailability(updatedRoom.getAvailability());
        existing.setFacilities(updatedRoom.getFacilities());

        return roomRepository.save(existing);
    }

    @Override
    public void deleteRoom(Long roomId) {
        roomRepository.deleteById(roomId);
    }

    @Override
    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Override
    public List<Room> getRoomsByOwnerByUserId(Long userId) {
        System.out.println("DEBUG: RoomServiceImpl.getRoomsByOwnerByUserId - userId: " + userId);
        PGOwner pgOwner = pgOwnerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("PG Owner not found for userId: " + userId));

        List<Room> rooms = roomRepository.findByPgOwnerOwnerId(pgOwner.getOwnerId());
        System.out.println("DEBUG: RoomServiceImpl.getRoomsByOwnerByUserId - found " + rooms.size() + " rooms");
        return rooms;
    }

    @Override
    public List<Room> getRoomsByOwnerId(Long ownerId) {
        System.out.println("DEBUG: RoomServiceImpl.getRoomsByOwnerId - ownerId: " + ownerId);
        return roomRepository.findByPgOwnerOwnerId(ownerId);
    }

    @Override
    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailabilityTrue();
    }

    @Override
    public List<Room> getAvailableRoomsByOwner(Long ownerId) {
        return roomRepository.findByPgOwnerOwnerIdAndAvailabilityTrue(ownerId);
    }

    @Override
    public List<Room> getRoomsByPriceRange(Double min, Double max) {
        return roomRepository.findByPriceBetween(min, max);
    }
}
