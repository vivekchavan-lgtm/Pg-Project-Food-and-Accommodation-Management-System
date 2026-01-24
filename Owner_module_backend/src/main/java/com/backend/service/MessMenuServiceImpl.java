package com.backend.service;

import com.backend.entity.MessMenu;
import com.backend.entity.MessOwner;
import com.backend.repos.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MessMenuServiceImpl implements MessMenuService {

    private final MessMenuRepository messMenuRepository;
    private final MessOwnerRepository messOwnerRepository;

    public MessMenuServiceImpl(MessMenuRepository messMenuRepository,
                               MessOwnerRepository messOwnerRepository) {
        this.messMenuRepository = messMenuRepository;
        this.messOwnerRepository = messOwnerRepository;
    }

    @Override
    public MessMenu addMenuItem(Long ownerId, MessMenu menu) {

        MessOwner messOwner = messOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Mess Owner not found"));

        menu.setMessOwner(messOwner);

        return messMenuRepository.save(menu);
    }

    @Override
    public MessMenu updateMenuItem(Long menuId, MessMenu updatedMenu) {

        MessMenu existing = messMenuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        existing.setItemName(updatedMenu.getItemName());
        existing.setPrice(updatedMenu.getPrice());
        existing.setCategory(updatedMenu.getCategory());
        existing.setAvailable(updatedMenu.getAvailable());

        return messMenuRepository.save(existing);
    }

    @Override
    public void deleteMenuItem(Long menuId) {
        messMenuRepository.deleteById(menuId);
    }

    @Override
    public MessMenu getMenuItemById(Long menuId) {
        return messMenuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }

    @Override
    public List<MessMenu> getMenuByOwner(Long ownerId) {
        return messMenuRepository.findByMessOwnerOwnerId(ownerId);
    }

    @Override
    public List<MessMenu> getAvailableMenuItems() {
        return messMenuRepository.findByAvailableTrue();
    }

    @Override
    public List<MessMenu> getAvailableMenuItemsByOwner(Long ownerId) {
        return messMenuRepository.findByMessOwnerOwnerIdAndAvailableTrue(ownerId);
    }

    @Override
    public List<MessMenu> getMenuItemsByPriceRange(Double min, Double max) {
        return messMenuRepository.findByPriceBetween(min, max);
    }

    @Override
    public List<MessMenu> getMenuByCategory(String category) {
        return messMenuRepository.findByCategory(category);
    }
}
