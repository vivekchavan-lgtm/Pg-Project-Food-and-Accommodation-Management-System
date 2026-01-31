package com.backend.ownerentity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mess_details")
@Getter
@Setter
@NoArgsConstructor
public class MessOwner extends Owner {

    @Column(name = "mess_name", nullable = false,length = 100)
    private String messName;

    @Convert(converter = MessTypeConverter.class)
    @Column(name = "mess_type", nullable = false)
    private MessType messType;   // VEG / NON_VEG / BOTH

    @Convert(converter = TimingConverter.class)
    @Column(name = "timings", nullable = false)
    private Timing timings;   // MORNING / EVENING / FULL_DAY

    @Column(name = "description",length = 500)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
