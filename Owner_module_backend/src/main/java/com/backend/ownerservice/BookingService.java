package com.backend.ownerservice;

import com.backend.dtos.BookingRequestDto;
import com.backend.ownerentity.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(BookingRequestDto request);
    List<Booking> getBookingsForOwner(Long ownerId);
    List<Booking> getBookingsForUser(Long userId);
}
