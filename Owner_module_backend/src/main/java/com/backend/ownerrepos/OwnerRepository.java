package com.backend.ownerrepos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.ownerentity.*;

import java.util.List;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {

    // Find owners by type (PG / MESS)
    List<Owner> findByOwnerType(OwnerType ownerType);

    // Find owner by email (useful for login / validation)
    Owner findByEmail(String email);

    // Optimized for Public Listings
    @org.springframework.data.jpa.repository.Query("SELECT o FROM Owner o WHERE o.ownerType = :ownerType AND o.status = :status")
    List<Owner> findByOwnerTypeAndStatus(@org.springframework.data.repository.query.Param("ownerType") OwnerType ownerType, @org.springframework.data.repository.query.Param("status") OwnerStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Owner o WHERE o.status = :status")
    List<Owner> findByStatus(@org.springframework.data.repository.query.Param("status") OwnerStatus status);

    java.util.Optional<Owner> findByUser_Id(Long userId);
}
