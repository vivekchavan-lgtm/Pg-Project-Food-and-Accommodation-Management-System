package com.backend.ownerrepos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.ownerentity.MessMenu;
import com.backend.ownerentity.MessOwner;

import java.util.List;

@Repository
public interface MessMenuRepository extends JpaRepository<MessMenu, Long> {

    // Get all menu items for a mess owner
    List<MessMenu> findByMessOwner(MessOwner messOwner);

    // Get menu items by ownerId
    @org.springframework.data.jpa.repository.Query("SELECT m FROM MessMenu m WHERE m.messOwner.ownerId = :ownerId")
    List<MessMenu> findByMessOwnerOwnerId(@org.springframework.data.repository.query.Param("ownerId") Long ownerId);

    // Get available menu items
    List<MessMenu> findByAvailableTrue();

    // Filter by category (Breakfast / Lunch / Dinner)
    List<MessMenu> findByCategory(String category);

    // Filter by price range
    List<MessMenu> findByPriceBetween(Double min, Double max);

    // Available items for a specific mess owner
    List<MessMenu> findByMessOwnerOwnerIdAndAvailableTrue(Long ownerId);
}
