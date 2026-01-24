package com.backend.service;

import com.backend.entity.PGOwner;

import java.util.List;

public interface PGService {

    PGOwner createPGOwner(PGOwner pgOwner);

    PGOwner updatePGDetails(Long ownerId, PGOwner pgOwner);

    PGOwner getPGOwner(Long ownerId);

    List<PGOwner> getAllPGOwners();
}
