package com.backend.ownerrepos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.ownerentity.*;

import java.util.List;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {

    // Find owners by type (PG / MESS)
    List<Owner> findByOwnerType(OwnerType ownerType);

    // Find owners by status
    List<Owner> findByStatus(OwnerStatus status);

    // Find owner by email (useful for login / validation)
    Owner findByEmail(String email);
}
