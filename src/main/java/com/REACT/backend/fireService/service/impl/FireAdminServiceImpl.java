package com.REACT.backend.fireService.service.impl;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.repository.BookingLogRepository;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.model.FireStationEntity;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.repository.FireStationRepository;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FireAdminServiceImpl implements FireAdminService {

    private final FireStationRepository fireStationRepository;
    private final FireTruckRepository fireTruckRepository;
    private final BookingLogRepository bookingLogRepository;

    @Override
    public List<FireTruckDto> getTrucksByStation(Long stationId) {
        FireStationEntity station = fireStationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Fire Station not found"));

        return station.getFireTruckEntities().stream()
                .map(FireTruckDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDto> getBookingHistoryByStation(Long stationId) {
        List<BookingLogEntity> bookings = bookingLogRepository.findAllByStationId(stationId);
        return bookings.stream().map(BookingDto::new).toList();
    }

    @Override
    public List<BookingDto> getBookingHistoryByTruck(Long truckId) {
        List<BookingLogEntity> bookings = bookingLogRepository.findAllByFireTruckId(truckId);
        return bookings.stream().map(BookingDto::new).toList();
    }

}
