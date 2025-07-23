package com.REACT.backend.policeService.service;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.common.dto.LocationDto;

import java.util.List;

public interface PoliceAdminService {

    /**
     * Get all booking history for a police station
     * @param stationId - ID of the police station
     * @return List of booking history
     */
    List<BookingDto> getBookingHistoryByStation(Long stationId);

    /**
     * Get location details of an emergency request by ID
     * @param requestId - ID of the emergency request
     * @return Location details of the request
     */
    LocationDto getRequestLocation(Long requestId);
}
