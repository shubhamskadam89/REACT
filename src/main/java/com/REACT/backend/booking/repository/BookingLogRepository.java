package com.REACT.backend.booking.repository;

import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingLogRepository extends JpaRepository<BookingLogEntity, Long> {

    Optional<BookingLogEntity> findByEmergencyRequest(EmergencyRequestEntity emergencyRequest);


}
