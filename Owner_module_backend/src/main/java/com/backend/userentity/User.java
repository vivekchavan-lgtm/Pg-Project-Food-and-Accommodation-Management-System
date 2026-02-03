package com.backend.userentity;

import com.backend.ownerentity.Owner;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 15)
    private String mobile;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 50)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    // 🔴 REQUIRED FOR SYSTEM
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role;   // USER / OWNER / ADMIN

    @Column(nullable = false)
    private boolean enabled = true;

    @org.hibernate.annotations.CreationTimestamp
    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;
    

    // Owner link
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Owner owner;
}
