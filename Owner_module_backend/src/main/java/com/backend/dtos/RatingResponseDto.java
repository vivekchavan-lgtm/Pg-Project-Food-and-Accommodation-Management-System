package com.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RatingResponseDto {
    private Long ratingId;
    private String userName; // First Name + Last Name
    private Integer score;
    private String feedback;
    private LocalDateTime createdAt;
}
