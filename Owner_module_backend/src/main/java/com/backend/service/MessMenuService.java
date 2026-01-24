package com.backend.service;

import com.backend.entity.MessMenu;

import java.util.List;

public interface MessMenuService {

    MessMenu addMenuItem(Long ownerId, MessMenu menu);

    MessMenu updateMenuItem(Long menuId, MessMenu menu);

    void deleteMenuItem(Long menuId);

    MessMenu getMenuItemById(Long menuId);

    List<MessMenu> getMenuByOwner(Long ownerId);

    List<MessMenu> getAvailableMenuItems();

    List<MessMenu> getAvailableMenuItemsByOwner(Long ownerId);

    List<MessMenu> getMenuItemsByPriceRange(Double min, Double max);

    List<MessMenu> getMenuByCategory(String category);
}
