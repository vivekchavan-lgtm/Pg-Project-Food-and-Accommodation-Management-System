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
    public Room addRoom(Long ownerId, Room room) {

        PGOwner pgOwner = pgOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("PG Owner not found"));

        room.setPgOwner(pgOwner);

        return roomRepository.save(room);
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
    public List<Room> getRoomsByOwner(Long ownerId) {
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
