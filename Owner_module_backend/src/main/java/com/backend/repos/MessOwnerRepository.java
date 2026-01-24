package com.backend.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entity.MessOwner;

import java.util.List;

@Repository
public interface MessOwnerRepository extends JpaRepository<MessOwner, Long> {

    List<MessOwner> findByMessType(Enum messType);
}
