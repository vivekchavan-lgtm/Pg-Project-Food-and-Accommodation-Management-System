package com.backend.ownerrepos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.ownerentity.PGOwner;

import java.util.List;

@Repository
public interface PGOwnerRepository extends JpaRepository<PGOwner, Long> {

    // Example: find PGs by type
    List<PGOwner> findByPgType(com.backend.ownerentity.PgType pgType);

    // Example: find PGs with minimum rooms
    List<PGOwner> findByTotalRoomsGreaterThan(int rooms);

    java.util.Optional<PGOwner> findByUser_Id(Long userId);
}
