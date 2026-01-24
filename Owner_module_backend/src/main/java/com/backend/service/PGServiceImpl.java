package com.backend.service;

import com.backend.entity.PGOwner;
import com.backend.repos.PGOwnerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PGServiceImpl implements PGService {

    private final PGOwnerRepository pgOwnerRepository;

    public PGServiceImpl(PGOwnerRepository pgOwnerRepository) {
        this.pgOwnerRepository = pgOwnerRepository;
    }

    @Override
    public PGOwner createPGOwner(PGOwner pgOwner) {
        return pgOwnerRepository.save(pgOwner);
    }

    @Override
    public PGOwner updatePGDetails(Long ownerId, PGOwner updatedPg) {
        PGOwner existing = pgOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("PG Owner not found"));

        existing.setPgName(updatedPg.getPgName());
        existing.setTotalRooms(updatedPg.getTotalRooms());
        existing.setPgType(updatedPg.getPgType());
        existing.setFacilities(updatedPg.getFacilities());

        return pgOwnerRepository.save(existing);
    }

    @Override
    public PGOwner getPGOwner(Long ownerId) {
        return pgOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("PG Owner not found"));
    }

    @Override
    public List<PGOwner> getAllPGOwners() {
        return pgOwnerRepository.findAll();
    }
}
