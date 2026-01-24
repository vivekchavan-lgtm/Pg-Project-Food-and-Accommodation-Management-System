package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "owners")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public class Owner {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "owner_id",nullable = false,unique = true)
    private Long ownerId;   // FK from Users table

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type", nullable = false)
    private OwnerType ownerType;   // PG / MESS

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "contact_no", nullable = false, length = 15)
    private String contactNo;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "address", nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OwnerStatus status;  // ACTIVE / INACTIVE / PENDING

    @Enumerated(EnumType.STRING)
    @Column(name = "id_card_type", nullable = false)
    private IdCardType idCardType;

    @Column(name = "id_card_number", nullable = false, unique = true)
    private String idCardNumber;
}
