package com.REACT.backend.fireService.repository;

import com.REACT.backend.fireService.model.FireStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FireStationRepository extends JpaRepository<FireStationEntity,Long> {
}
