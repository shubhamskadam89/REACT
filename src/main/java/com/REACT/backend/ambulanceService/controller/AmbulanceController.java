package com.REACT.backend.ambulanceService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.service.AmbulanceLocationService;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceLocationServiceImplementation;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceServiceImpl;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/ambulance/location")
@RequiredArgsConstructor

public class AmbulanceController {

    @Autowired
    AmbulanceLocationServiceImplementation ambulanceLocationServiceImplementation;



    @PostMapping("/update")
    public ResponseEntity<String> updateAmbulanceLocation(@RequestBody AmbulanceLocationUpdateDto dto) {
        ambulanceLocationServiceImplementation.updateLocation(dto);
        return ResponseEntity.ok("Location updated and broadcasted");
    }
}
