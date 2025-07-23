package com.REACT.backend.policeService.controller;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.policeService.service.PoliceAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/police/admin")
public class PoliceAdminController {

    private final PoliceAdminService policeAdminService;

    /**
     * Get all booking history for a police station
     * @param stationId - ID of the police station
     * @return List of booking history
     */
    @GetMapping("/station/{stationId}/history")
    public ResponseEntity<List<BookingDto>> getStationHistory(@PathVariable Long stationId) {
        log.info("Fetching booking history for police station ID: {}", stationId);
        List<BookingDto> history = policeAdminService.getBookingHistoryByStation(stationId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get location details of an emergency request by ID
     * @param requestId - ID of the emergency request
     * @return Location details of the request
     */
    @GetMapping("/request/{requestId}/location")
    public ResponseEntity<LocationDto> getRequestLocation(@PathVariable Long requestId) {
        log.info("Fetching location for emergency request ID: {}", requestId);
        LocationDto location = policeAdminService.getRequestLocation(requestId);
        return ResponseEntity.ok(location);
    }

    /**
     * Get all police units/officers assigned to a specific station
     * @param stationId - ID of the police station
     * @return List of police units for the station
     */
    @GetMapping("/station/{stationId}/units")
    public ResponseEntity<?> getUnitsByStation(@PathVariable Long stationId) {
        log.info("Fetching police units for station ID: {}", stationId);
        // This can be implemented when police unit entities are fully defined
        return ResponseEntity.ok("Police units endpoint - to be implemented when PoliceUnitEntity is completed");
    }
}
