package com.backend.ownerservice;

import com.backend.dtos.BookingRequestDto;
import com.backend.dtos.BookingResponseDto;
import com.backend.ownerentity.Booking;
import java.util.List;

public interface BookingService {
    BookingResponseDto createBooking(BookingRequestDto request);
    
    // Explicit lookup by User ID (for Dashboards logged in as User)
    List<BookingResponseDto> getBookingsForOwnerByUserId(Long userId);

    // Explicit lookup by Owner ID (for Admin or Public views)
    List<BookingResponseDto> getBookingsForOwnerId(Long ownerId);

    List<BookingResponseDto> getBookingsForUser(Long userId);

    BookingResponseDto updateBookingStatus(Long bookingId, String status);
}
