package com.backend.ownerservice;

import java.util.List;

import com.backend.ownerentity.PGOwner;

public interface PGService {

    PGOwner createPGOwner(PGOwner pgOwner);

    PGOwner updatePGDetails(Long ownerId, PGOwner pgOwner);

    PGOwner getPGOwner(Long ownerId);

    List<PGOwner> getAllPGOwners();
}
