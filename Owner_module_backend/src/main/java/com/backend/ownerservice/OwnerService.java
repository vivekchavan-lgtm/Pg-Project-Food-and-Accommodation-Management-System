package com.backend.ownerservice;

import java.util.List;

import com.backend.ownerentity.*;

public interface OwnerService {

    Owner createOwner(Owner owner);

    Owner getOwnerById(Long ownerId);

    Owner getOwnerByUserId(Long userId);

    List<Owner> getAllOwners();

    List<Owner> getOwnersByType(OwnerType ownerType);

    List<Owner> getOwnersByStatus(OwnerStatus status);

    List<Owner> getOwnersByTypeAndStatus(OwnerType type, OwnerStatus status);

    Owner updateOwnerStatus(Long ownerId, OwnerStatus status);

    Owner updateOwnerProfile(Long ownerId, com.backend.dtos.OwnerProfileUpdateDto dto);

    void deleteOwner(Long ownerId);
}
