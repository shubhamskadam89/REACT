package com.REACT.backend.fireService.service;

import com.REACT.backend.fireService.dto.FireTruckDto;

import java.util.List;

public interface FireAdminService {
    List<FireTruckDto> getTrucksByStation(Long stationId);
    Object getBookingHistoryByStation(Long stationId); // Replace Object with Booking DTO list if you have
    Object getBookingHistoryByTruck(Long truckId);
}
