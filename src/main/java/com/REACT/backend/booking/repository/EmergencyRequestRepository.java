package com.REACT.backend.booking.repository;

import com.REACT.backend.booking.model.EmergencyRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequestEntity, Long> {
}
