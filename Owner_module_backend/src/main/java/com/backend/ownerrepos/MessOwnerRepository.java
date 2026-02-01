package com.backend.ownerrepos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.ownerentity.MessOwner;

import java.util.List;

@Repository
public interface MessOwnerRepository extends JpaRepository<MessOwner, Long> {

    List<MessOwner> findByMessType(com.backend.ownerentity.MessType messType);

    java.util.Optional<MessOwner> findByUser_Id(Long userId);
}
