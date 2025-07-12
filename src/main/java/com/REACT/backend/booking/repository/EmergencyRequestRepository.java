package com.REACT.backend.booking.repository;

import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequestEntity, Long> {

    List<EmergencyRequestEntity> findByDriver_UserIdAndEmergencyRequestStatus(
            Long driverId, EmergencyRequestStatus status);

    List<EmergencyRequestEntity> findByRequestedBy_UserIdAndEmergencyRequestStatus(
            Long userId, EmergencyRequestStatus status);

}
