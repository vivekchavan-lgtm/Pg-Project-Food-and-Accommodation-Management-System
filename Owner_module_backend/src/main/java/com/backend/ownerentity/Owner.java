package com.backend.ownerentity;

import com.backend.userentity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "owners")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Owner {

    @Id
    @Column(name = "owner_id")
    private Long ownerId;

    // Shared primary key with User
    @OneToOne
    @MapsId
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User user;

    @Convert(converter = OwnerTypeConverter.class)
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

    @Convert(converter = OwnerStatusConverter.class)
    @Column(name = "status", nullable = false)
    private OwnerStatus status;  // ACTIVE / INACTIVE / PENDING

    @Convert(converter = IdCardTypeConverter.class)
    @Column(name = "id_card_type", nullable = false)
    private IdCardType idCardType;

    @Column(name = "id_card_number", nullable = false, unique = true)
    private String idCardNumber;
}
