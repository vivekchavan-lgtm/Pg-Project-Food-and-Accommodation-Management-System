package com.backend.ownerservice;

import com.backend.ownerentity.MessOwner;
import com.backend.ownerrepos.MessOwnerRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MessServiceImpl implements MessService {

    private final MessOwnerRepository messOwnerRepository;

    public MessServiceImpl(MessOwnerRepository messOwnerRepository) {
        this.messOwnerRepository = messOwnerRepository;
    }

    @Override
    public MessOwner createMessOwner(MessOwner messOwner) {
        return messOwnerRepository.save(messOwner);
    }

    @Override
    public MessOwner updateMessDetails(Long ownerId, MessOwner updated) {
        MessOwner existing = messOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Mess Owner not found"));

        existing.setMessName(updated.getMessName());
        existing.setMessType(updated.getMessType());
        existing.setTimings(updated.getTimings());
        existing.setDescription(updated.getDescription());

        return messOwnerRepository.save(existing);
    }

    @Override
    public MessOwner getMessOwner(Long ownerId) {
        return messOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Mess Owner not found"));
    }

    @Override
    public List<MessOwner> getAllMessOwners() {
        return messOwnerRepository.findAll();
    }
}
