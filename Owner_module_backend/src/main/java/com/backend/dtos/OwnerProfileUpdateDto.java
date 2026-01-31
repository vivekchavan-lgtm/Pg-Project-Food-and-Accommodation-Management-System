package com.backend.dtos;

import com.backend.ownerentity.IdCardType;
import com.backend.ownerentity.MessType;
import com.backend.ownerentity.PgType;
import com.backend.ownerentity.Timing;
import lombok.Data;

@Data
public class OwnerProfileUpdateDto {
    
    // Common
    private String name;
    private String contactNo;
    private String address;
    private IdCardType idCardType;
    private String idCardNumber;

    // PG
    private String pgName;
    private Integer totalRooms;
    private PgType pgType;
    private String facilities;

    // Mess
    private String messName;
    private MessType messType;
    private Timing timings;
    private String description;
    private String imageUrl;
}
