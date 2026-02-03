package com.backend.ownerservice;

import com.backend.ownerentity.*;
import com.backend.ownerrepos.OwnerRepository;

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
    public Owner getOwnerByUserId(Long userId) {
        return ownerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Owner not found for userId: " + userId));
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
    public List<Owner> getOwnersByTypeAndStatus(OwnerType type, OwnerStatus status) {
        return ownerRepository.findByOwnerTypeAndStatus(type, status);
    }

    @Override
    public Owner updateOwnerStatus(Long ownerId, OwnerStatus status) {
        Owner owner = getOwnerById(ownerId);
        owner.setStatus(status);
        return ownerRepository.save(owner);
    }

    @Override
    public Owner updateOwnerProfile(Long ownerId, com.backend.dtos.OwnerProfileUpdateDto dto) {
        System.out.println("DEBUG: Updating profile for ownerId: " + ownerId);
        System.out.println("DEBUG: Incoming DTO: " + dto);
        
        Owner owner = getOwnerById(ownerId);
        
        // Update Common Fields
        if(dto.getName() != null) owner.setName(dto.getName());
        if(dto.getContactNo() != null) owner.setContactNo(dto.getContactNo());
        if(dto.getAddress() != null) owner.setAddress(dto.getAddress());
        if(dto.getIdCardType() != null) owner.setIdCardType(dto.getIdCardType());
        if(dto.getIdCardNumber() != null) owner.setIdCardNumber(dto.getIdCardNumber());
        
        // Update specific fields based on type
        if(owner instanceof PGOwner) {
             System.out.println("DEBUG: Detected PGOwner");
             PGOwner pg = (PGOwner) owner;
             if(dto.getPgName() != null) pg.setPgName(dto.getPgName());
             if(dto.getTotalRooms() != null) pg.setTotalRooms(dto.getTotalRooms());
             if(dto.getPgType() != null) pg.setPgType(dto.getPgType());
             if(dto.getFacilities() != null) pg.setFacilities(dto.getFacilities());
             if(dto.getImageUrl() != null) pg.setImageUrl(dto.getImageUrl());
        } else if (owner instanceof MessOwner) {
             System.out.println("DEBUG: Detected MessOwner");
             MessOwner mess = (MessOwner) owner;
             if(dto.getMessName() != null) mess.setMessName(dto.getMessName());
             if(dto.getMessType() != null) mess.setMessType(dto.getMessType());
             if(dto.getTimings() != null) mess.setTimings(dto.getTimings());
             if(dto.getDescription() != null) mess.setDescription(dto.getDescription());
             if(dto.getImageUrl() != null) mess.setImageUrl(dto.getImageUrl());
        }

        Owner updatedOwner = ownerRepository.save(owner);
        System.out.println("DEBUG: Profile saved successfully for: " + updatedOwner.getEmail());
        return updatedOwner;
    }

    @Override
    public void deleteOwner(Long ownerId) {
        ownerRepository.deleteById(ownerId);
    }
}
