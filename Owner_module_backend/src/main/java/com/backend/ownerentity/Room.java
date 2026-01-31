package com.backend.ownerentity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "availability", nullable = false)
    private Boolean availability;

    @Column(name = "facilities")
    private String facilities;

    // 🔗 Relationship to PGOwner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private PGOwner pgOwner;
}
