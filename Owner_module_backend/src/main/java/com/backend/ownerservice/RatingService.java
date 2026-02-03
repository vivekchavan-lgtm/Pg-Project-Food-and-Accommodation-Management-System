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
    private final com.backend.ownerrepos.BookingRepository bookingRepository;

    public RatingService(RatingRepository ratingRepository, OwnerRepository ownerRepository, UserRepository userRepository, com.backend.ownerrepos.BookingRepository bookingRepository) {
        this.ratingRepository = ratingRepository;
        this.ownerRepository = ownerRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public Rating addRating(RatingRequest request) {
        // Validation: Check if user has an ACCEPTED booking with this owner
        boolean hasAcceptedBooking = bookingRepository.existsByUser_IdAndOwner_OwnerIdAndStatus(
                request.getUserId(), request.getOwnerId(), com.backend.ownerentity.BookingStatus.ACCEPTED);

        if (!hasAcceptedBooking) {
            throw new RuntimeException("You can only rate owners after your booking is accepted.");
        }

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

    public java.util.List<com.backend.dtos.RatingResponseDto> getOwnerRatings(Long userId) {
        // Find owner by ID (the userId passed here is actually ownerId based on controller usage, let's correct that assumption)
        // Controller: getRatings(@PathVariable Long ownerId) -> service.getOwnerRatings(ownerId)
        // So the argument is ownerId.
        
        List<Rating> ratings = ratingRepository.findByOwner_OwnerId(userId);
        
        return ratings.stream().map(rating -> {
            com.backend.dtos.RatingResponseDto dto = new com.backend.dtos.RatingResponseDto();
            dto.setRatingId(rating.getRatingId());
            dto.setUserName(rating.getUser().getFirstName() + " " + rating.getUser().getLastName());
            dto.setScore(rating.getScore());
            dto.setFeedback(rating.getFeedback());
            dto.setCreatedAt(rating.getCreatedAt());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    public Double getAverageRating(Long userId) {
        Owner owner = ownerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Owner not found for userId: " + userId));
        Double avg = ratingRepository.getAverageRating(owner.getOwnerId());
        return avg != null ? avg : 0.0;
    }
}
