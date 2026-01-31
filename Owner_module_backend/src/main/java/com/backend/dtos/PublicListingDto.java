package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicListingDto {
    private Long ownerId;
    private String name;
    private String email;
    private String contactNo;
    private String address;
    private String ownerType; // PG or MESS
    private String status;
    
    // PG specific fields
    private String pgName;
    private String pgType;
    private String facilities;
    private String imageUrl;
    
    // Mess specific fields
    private String messName;
    private String messType;
    private String timings;
    private String description;
}
