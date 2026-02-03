package com.backend.ownerservice;

import com.backend.dtos.BookingRequestDto;
import com.backend.ownerentity.Booking;
import com.backend.ownerentity.BookingStatus;
import com.backend.ownerentity.Owner;
import com.backend.ownerrepos.BookingRepository;
import com.backend.ownerrepos.OwnerRepository;
import com.backend.userentity.User;
import com.backend.userrepos.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, OwnerRepository ownerRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
    }

    @Override
    public com.backend.dtos.BookingResponseDto createBooking(BookingRequestDto request) {
        System.out.println("DEBUG: Creating Booking - UserId: " + request.getUserId() + ", OwnerId: " + request.getOwnerId());
        
        // Validation
        if (bookingRepository.existsByUser_IdAndOwner_OwnerId(request.getUserId(), request.getOwnerId())) {
            System.out.println("DEBUG: Booking already exists");
            throw new RuntimeException("You have already sent a booking request to this owner.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setOwner(owner);
        booking.setMessage(request.getMessage());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return mapToDto(saved);
    }

    @Override
    public List<com.backend.dtos.BookingResponseDto> getBookingsForOwnerByUserId(Long userId) {
        System.out.println("DEBUG: getBookingsForOwnerByUserId: " + userId);
        Owner owner = ownerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Owner not found for userId: " + userId));
        
        List<Booking> bookings = bookingRepository.findByOwner_OwnerIdOrderByCreatedAtDesc(owner.getOwnerId());
        return bookings.stream().map(this::mapToDto).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<com.backend.dtos.BookingResponseDto> getBookingsForOwnerId(Long ownerId) {
        System.out.println("DEBUG: getBookingsForOwnerId: " + ownerId);
        List<Booking> bookings = bookingRepository.findByOwner_OwnerIdOrderByCreatedAtDesc(ownerId);
        return bookings.stream().map(this::mapToDto).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<com.backend.dtos.BookingResponseDto> getBookingsForUser(Long userId) {
        List<Booking> bookings = bookingRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        return bookings.stream().map(this::mapToDto).collect(java.util.stream.Collectors.toList());
    }

    private com.backend.dtos.BookingResponseDto mapToDto(Booking booking) {
        com.backend.dtos.BookingResponseDto dto = new com.backend.dtos.BookingResponseDto();
        dto.setBookingId(booking.getBookingId());
        dto.setMessage(booking.getMessage());
        dto.setStatus(booking.getStatus().name());
        dto.setCreatedAt(booking.getCreatedAt());
        
        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUserName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            dto.setUserMobile(booking.getUser().getMobile());
        }
        
        if (booking.getOwner() != null) {
            dto.setOwnerId(booking.getOwner().getOwnerId());
            dto.setOwnerName(booking.getOwner().getName());
        }
        return dto;
    }

    @Override
    public com.backend.dtos.BookingResponseDto updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        try {
            BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(newStatus);
            Booking saved = bookingRepository.save(booking);
            return mapToDto(saved);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid booking status: " + status);
        }
    }
}
