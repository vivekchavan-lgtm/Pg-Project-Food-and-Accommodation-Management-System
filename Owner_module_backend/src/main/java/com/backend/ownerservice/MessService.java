package com.backend.ownerservice;

import java.util.List;

import com.backend.ownerentity.MessOwner;

public interface MessService {

    MessOwner createMessOwner(MessOwner messOwner);

    MessOwner updateMessDetails(Long ownerId, MessOwner messOwner);

    MessOwner getMessOwner(Long ownerId);

    List<MessOwner> getAllMessOwners();
}
