package com.backend.ownerentity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "pg_details")
@Getter
@Setter
@NoArgsConstructor
public class PGOwner extends Owner {

    @Column(name = "pg_name", nullable = false,length = 100)
    private String pgName;

    @Column(name = "total_rooms", nullable = false)
    @Min(1)
    private int totalRooms;

    @Convert(converter = PgTypeConverter.class)
    @Column(name = "pg_type", nullable = false)
    private PgType pgType;   // BOYS / GIRLS / BOTH

    @Column(name = "facilities" ,length = 500)
    private String facilities;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
