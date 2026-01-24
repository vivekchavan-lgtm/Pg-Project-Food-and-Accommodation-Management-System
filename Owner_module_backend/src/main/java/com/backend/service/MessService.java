package com.backend.service;

import com.backend.entity.MessOwner;

import java.util.List;

public interface MessService {

    MessOwner createMessOwner(MessOwner messOwner);

    MessOwner updateMessDetails(Long ownerId, MessOwner messOwner);

    MessOwner getMessOwner(Long ownerId);

    List<MessOwner> getAllMessOwners();
}
