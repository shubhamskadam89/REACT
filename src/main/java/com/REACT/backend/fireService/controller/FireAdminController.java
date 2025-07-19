package com.REACT.backend.fireService.controller;

import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.service.FireAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fire/admin")
public class FireAdminController {

    private final FireAdminService fireAdminService;

    // Get all trucks of a fire station
    @GetMapping("/station/{stationId}/trucks")
    public ResponseEntity<List<FireTruckDto>> getTrucksByStation(@PathVariable Long stationId) {
        return ResponseEntity.ok(fireAdminService.getTrucksByStation(stationId));
    }

    //  Get booking history of a fire station
    @GetMapping("/station/{stationId}/history")
    public ResponseEntity<?> getStationHistory(@PathVariable Long stationId) {
        return ResponseEntity.ok(fireAdminService.getBookingHistoryByStation(stationId));
    }

    // Get booking history of a fire truck
    @GetMapping("/truck/{truckId}/history")
    public ResponseEntity<?> getTruckHistory(@PathVariable Long truckId) {
        return ResponseEntity.ok(fireAdminService.getBookingHistoryByTruck(truckId));
    }
}
