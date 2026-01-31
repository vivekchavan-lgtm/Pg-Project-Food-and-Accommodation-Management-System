package com.backend.dtos;

import lombok.Data;

@Data
public class BookingRequestDto {
    private Long userId;
    private Long ownerId;
    private String message;
}
