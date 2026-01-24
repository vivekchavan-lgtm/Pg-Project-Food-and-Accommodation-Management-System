package com.backend.service;

import com.backend.entity.*;
import com.backend.repos.OwnerRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OwnerServiceImpl implements OwnerService {

    private final OwnerRepository ownerRepository;

    public OwnerServiceImpl(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    @Override
    public Owner createOwner(Owner owner) {
        return ownerRepository.save(owner);
    }

    @Override
    public Owner getOwnerById(Long ownerId) {
        return ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
    }

    @Override
    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    @Override
    public List<Owner> getOwnersByType(OwnerType ownerType) {
        return ownerRepository.findByOwnerType(ownerType);
    }

    @Override
    public List<Owner> getOwnersByStatus(OwnerStatus status) {
        return ownerRepository.findByStatus(status);
    }

    @Override
    public Owner updateOwnerStatus(Long ownerId, OwnerStatus status) {
        Owner owner = getOwnerById(ownerId);
        owner.setStatus(status);
        return ownerRepository.save(owner);
    }

    @Override
    public void deleteOwner(Long ownerId) {
        ownerRepository.deleteById(ownerId);
    }
}
