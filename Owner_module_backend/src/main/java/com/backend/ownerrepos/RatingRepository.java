package com.backend.ownerrepos;

import com.backend.ownerentity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByOwner_OwnerId(Long ownerId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.owner.ownerId = :ownerId")
    Double getAverageRating(Long ownerId);
}
