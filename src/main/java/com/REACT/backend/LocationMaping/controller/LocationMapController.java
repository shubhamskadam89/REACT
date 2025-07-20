package com.REACT.backend.LocationMaping.controller;

import com.REACT.backend.LocationMaping.dto.LocationMapDto;
import com.REACT.backend.LocationMaping.services.LocationMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/location-map")
@RequiredArgsConstructor
public class LocationMapController {

    private final LocationMapService service;

    @GetMapping("/{emergencyRequestId}")
    public ResponseEntity<LocationMapDto> getLocationMap(@PathVariable Long emergencyRequestId) {
        LocationMapDto dto = service.getLocationMap(emergencyRequestId);
        return ResponseEntity.ok(dto);
    }
}
