package com.backend.ownercontroller;

import com.backend.ownerentity.MessMenu;
import com.backend.ownerservice.MessMenuService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mess/menu")
public class MessMenuController {

    private final MessMenuService messMenuService;

    public MessMenuController(MessMenuService messMenuService) {
        this.messMenuService = messMenuService;
    }

    // ---------------- MESS OWNER APIs ----------------

    // Add new menu item
    @PostMapping("/owner/{ownerId}")
    public ResponseEntity<MessMenu> addMenuItem(
            @PathVariable Long ownerId,
            @RequestBody MessMenu menu) {

        return ResponseEntity.ok(messMenuService.addMenuItem(ownerId, menu));
    }

    // Update menu item
    @PutMapping("/{menuId}")
    public ResponseEntity<MessMenu> updateMenuItem(
            @PathVariable Long menuId,
            @RequestBody MessMenu menu) {

        return ResponseEntity.ok(messMenuService.updateMenuItem(menuId, menu));
    }

    // Delete menu item
    @DeleteMapping("/{menuId}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long menuId) {

        messMenuService.deleteMenuItem(menuId);
        return ResponseEntity.noContent().build();
    }

    // ---------------- USER / COMMON APIs ----------------

    // Get menu item by ID
    @GetMapping("/{menuId}")
    public ResponseEntity<MessMenu> getMenuItem(@PathVariable Long menuId) {

        return ResponseEntity.ok(messMenuService.getMenuItemById(menuId));
    }

    // Get all menu items for a mess owner (Dashboard uses USER ID)
    @GetMapping("/owner/{userId}")
    public ResponseEntity<?> getMenuByOwner(@PathVariable Long userId) {
        System.out.println("DEBUG: Fetching Menu for Owner associated with UserId: " + userId);
        try {
            return ResponseEntity.ok(messMenuService.getMenuByOwnerByUserId(userId));
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR in getMenuByOwner: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching menu: " + e.getMessage());
        }
    }

    // Get all available menu items
    @GetMapping("/available")
    public ResponseEntity<List<MessMenu>> getAvailableMenuItems() {

        return ResponseEntity.ok(messMenuService.getAvailableMenuItems());
    }

    // Get available menu items for specific owner
    @GetMapping("/available/owner/{ownerId}")
    public ResponseEntity<List<MessMenu>> getAvailableMenuItemsByOwner(
            @PathVariable Long ownerId) {

        return ResponseEntity.ok(
                messMenuService.getAvailableMenuItemsByOwner(ownerId)
        );
    }

    // Filter menu by price
    @GetMapping("/price")
    public ResponseEntity<List<MessMenu>> getByPriceRange(
            @RequestParam Double min,
            @RequestParam Double max) {

        return ResponseEntity.ok(
                messMenuService.getMenuItemsByPriceRange(min, max)
        );
    }

    // Filter by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MessMenu>> getByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                messMenuService.getMenuByCategory(category)
        );
    }
}
