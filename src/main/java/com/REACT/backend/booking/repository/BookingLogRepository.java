package com.REACT.backend.booking.repository;

import com.REACT.backend.booking.model.BookingLogEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingLogRepository extends JpaRepository<BookingLogEntity, Long> {



}
