package com.backend.dtos;

import lombok.Data;

@Data
public class RatingRequest {
    private Long userId;
    private Long ownerId;
    private Integer score;
    private String feedback;
}
