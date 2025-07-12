package com.REACT.backend.booking.repository;

import com.REACT.backend.booking.dto.BookingSummeryDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequestEntity, Long> {


    @Query("SELECT e FROM EmergencyRequestEntity e WHERE e.requestedBy.id = :userId ORDER BY e.createdAt DESC")
    List<EmergencyRequestEntity> findAllByRequestedById(@Param("userId") Long userId);


    List<EmergencyRequestEntity> findByDriver_UserIdAndEmergencyRequestStatus(
            Long driverId, EmergencyRequestStatus status);

    List<EmergencyRequestEntity> findByRequestedBy_UserIdAndEmergencyRequestStatus(
            Long userId, EmergencyRequestStatus status);


}
