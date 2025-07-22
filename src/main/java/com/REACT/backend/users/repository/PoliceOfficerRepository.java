package com.REACT.backend.users.repository;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.PoliceOfficer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PoliceOfficerRepository  extends JpaRepository<PoliceOfficer,Long> {
    Optional<?> findByPoliceOfficer(AppUser user);
}
