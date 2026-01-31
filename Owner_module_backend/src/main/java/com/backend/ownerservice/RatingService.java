package com.backend.ownerservice;

import com.backend.dtos.RatingRequest;
import com.backend.ownerentity.Owner;
import com.backend.ownerentity.Rating;
import com.backend.ownerrepos.OwnerRepository;
import com.backend.ownerrepos.RatingRepository;
import com.backend.userentity.User;
import com.backend.userrepos.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RatingService {

    private final RatingRepository ratingRepository;
    private final OwnerRepository ownerRepository;
    private final UserRepository userRepository;

    public RatingService(RatingRepository ratingRepository, OwnerRepository ownerRepository, UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.ownerRepository = ownerRepository;
        this.userRepository = userRepository;
    }

    public Rating addRating(RatingRequest request) {
        Owner owner = ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = new Rating();
        rating.setOwner(owner);
        rating.setUser(user);
        rating.setScore(request.getScore());
        rating.setFeedback(request.getFeedback());

        return ratingRepository.save(rating);
    }

    public List<Rating> getOwnerRatings(Long userId) {
        Owner owner = ownerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Owner not found for userId: " + userId));
        return ratingRepository.findByOwner_OwnerId(owner.getOwnerId());
    }

    public Double getAverageRating(Long userId) {
        Owner owner = ownerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Owner not found for userId: " + userId));
        Double avg = ratingRepository.getAverageRating(owner.getOwnerId());
        return avg != null ? avg : 0.0;
    }
}
