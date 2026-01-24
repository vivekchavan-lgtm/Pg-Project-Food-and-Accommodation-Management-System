package com.backend.service;

import com.backend.entity.*;
import java.util.List;

public interface OwnerService {

    Owner createOwner(Owner owner);

    Owner getOwnerById(Long ownerId);

    List<Owner> getAllOwners();

    List<Owner> getOwnersByType(OwnerType ownerType);

    List<Owner> getOwnersByStatus(OwnerStatus status);

    Owner updateOwnerStatus(Long ownerId, OwnerStatus status);

    void deleteOwner(Long ownerId);
}
