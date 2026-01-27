package com.backend.ownerservice;

import java.util.List;

import com.backend.ownerentity.*;

public interface OwnerService {

    Owner createOwner(Owner owner);

    Owner getOwnerById(Long ownerId);

    List<Owner> getAllOwners();

    List<Owner> getOwnersByType(OwnerType ownerType);

    List<Owner> getOwnersByStatus(OwnerStatus status);

    Owner updateOwnerStatus(Long ownerId, OwnerStatus status);

    void deleteOwner(Long ownerId);
}
