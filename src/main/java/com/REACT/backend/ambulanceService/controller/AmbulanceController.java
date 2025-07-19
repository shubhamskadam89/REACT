package com.REACT.backend.ambulanceService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceLocationServiceImplementation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/ambulance/location")
@RequiredArgsConstructor

public class AmbulanceController {

    @Autowired
    AmbulanceLocationServiceImplementation ambulanceLocationServiceImplementation;

    @Autowired
    private final AmbulanceService ambulanceService;


    @PostMapping("/update")
    public ResponseEntity<String> updateAmbulanceLocation(@RequestBody AmbulanceLocationUpdateDto dto) {
        log.info("Location update request fetched for ambulance {}",dto.getAmbulanceId());
        ambulanceLocationServiceImplementation.updateLocation(dto);
        return ResponseEntity.ok("Location updated and broadcasted");
    }


}
