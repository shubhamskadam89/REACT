package com.REACT.backend.users.repository;

import com.REACT.backend.users.model.AmbulanceDriver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmbulanceDriverRepository extends JpaRepository<AmbulanceDriver, Long> {
}
