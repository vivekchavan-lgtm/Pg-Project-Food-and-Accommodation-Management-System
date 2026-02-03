package com.backend.ownercontroller;

import com.backend.dtos.RatingRequest;
import com.backend.ownerentity.Rating;
import com.backend.ownerservice.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<String> addRating(@RequestBody RatingRequest request) {
        ratingService.addRating(request);
        return ResponseEntity.ok("Rating submitted successfully");
    }

    @GetMapping("/{ownerId}")
    public ResponseEntity<List<com.backend.dtos.RatingResponseDto>> getRatings(@PathVariable Long ownerId) {
        return ResponseEntity.ok(ratingService.getOwnerRatings(ownerId));
    }

    @GetMapping("/{ownerId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long ownerId) {
        return ResponseEntity.ok(ratingService.getAverageRating(ownerId));
    }
}
