package com.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingResponseDto {
    private Long bookingId;
    private String message;
    private String status;
    private LocalDateTime createdAt;
    
    // User details (Simplified)
    private Long userId;
    private String userName;
    private String userMobile;
    
    // Owner details (Simplified)
    private Long ownerId;
    private String ownerName;
}
