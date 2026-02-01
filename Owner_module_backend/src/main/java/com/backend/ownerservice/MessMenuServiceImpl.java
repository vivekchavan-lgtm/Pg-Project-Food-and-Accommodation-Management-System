package com.backend.ownerservice;

import com.backend.ownerentity.MessMenu;
import com.backend.ownerentity.MessOwner;
import com.backend.ownerrepos.*;

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
    public MessMenu addMenuItem(Long userId, MessMenu menu) {
        System.out.println("DEBUG: MessMenuServiceImpl.addMenuItem - Searching owner for userId: " + userId);
        MessOwner messOwner = messOwnerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Mess Owner not found for userId: " + userId));

        System.out.println("DEBUG: MessMenuServiceImpl.addMenuItem - Found owner: " + messOwner.getEmail());
        menu.setMessOwner(messOwner);

        MessMenu saved = messMenuRepository.save(menu);
        System.out.println("DEBUG: MessMenuServiceImpl.addMenuItem - Saved item: " + saved.getItemName());
        return saved;
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
    public List<MessMenu> getMenuByOwnerByUserId(Long userId) {
        System.out.println("DEBUG: MessMenuServiceImpl.getMenuByOwnerByUserId - userId: " + userId);
        MessOwner messOwner = messOwnerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Mess Owner not found for userId: " + userId));
        
        List<MessMenu> items = messMenuRepository.findByMessOwnerOwnerId(messOwner.getOwnerId());
        System.out.println("DEBUG: MessMenuServiceImpl.getMenuByOwnerByUserId - found " + items.size() + " items");
        return items;
    }

    @Override
    public List<MessMenu> getMenuByOwnerId(Long ownerId) {
        System.out.println("DEBUG: MessMenuServiceImpl.getMenuByOwnerId - ownerId: " + ownerId);
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
