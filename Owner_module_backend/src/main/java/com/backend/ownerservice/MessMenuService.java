package com.backend.ownerservice;

import java.util.List;

import com.backend.ownerentity.MessMenu;

public interface MessMenuService {

    MessMenu addMenuItem(Long ownerId, MessMenu menu);

    MessMenu updateMenuItem(Long menuId, MessMenu menu);

    void deleteMenuItem(Long menuId);

    MessMenu getMenuItemById(Long menuId);

    // Explicit lookup by User ID
    List<MessMenu> getMenuByOwnerByUserId(Long userId);

    // Explicit lookup by Owner ID
    List<MessMenu> getMenuByOwnerId(Long ownerId);

    List<MessMenu> getAvailableMenuItems();

    List<MessMenu> getAvailableMenuItemsByOwner(Long ownerId);

    List<MessMenu> getMenuItemsByPriceRange(Double min, Double max);

    List<MessMenu> getMenuByCategory(String category);
}
