package com.backend.ownerentity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "mess_menu")
@Getter
@Setter
@NoArgsConstructor
public class MessMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Long menuId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "category")
    private String category;   // Breakfast / Lunch / Dinner

    @Column(name = "available", nullable = false)
    private Boolean available;

    // 🔗 Relationship to MessOwner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private MessOwner messOwner;
}
