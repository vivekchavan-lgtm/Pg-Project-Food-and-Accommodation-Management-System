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
    public Booking createBooking(BookingRequestDto request) {
        // Validation
        if (bookingRepository.existsByUser_IdAndOwner_OwnerId(request.getUserId(), request.getOwnerId())) {
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

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getBookingsForOwner(Long userId) {
        Owner owner = ownerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Owner not found for userId: " + userId));
        return bookingRepository.findByOwner_OwnerIdOrderByCreatedAtDesc(owner.getOwnerId());
    }

    @Override
    public List<Booking> getBookingsForUser(Long userId) {
        return bookingRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }
}
