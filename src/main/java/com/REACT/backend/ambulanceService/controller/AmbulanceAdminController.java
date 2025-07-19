package com.REACT.backend.ambulanceService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceLocationServiceImplementation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@Slf4j
@RestController
@RequestMapping("/ambulance")
@RequiredArgsConstructor

public class AmbulanceAdminController
{
    AmbulanceLocationServiceImplementation ambulanceLocationServiceImplementation;

    @Autowired
    private final AmbulanceService ambulanceService;

    @GetMapping("/all")
    public ResponseEntity<List<AmbulanceDto>> getAllAmbulances() {
        return ResponseEntity.ok(ambulanceService.getAllAmbulances());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmbulanceDto> getAmbulanceById(@PathVariable Long id) {
        return ResponseEntity.ok(ambulanceService.getAmbulanceById(id));
    }

    @GetMapping("/by-hospital/{hospitalId}")
    public ResponseEntity<List<AmbulanceDto>> getAmbulancesByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(ambulanceService.getAmbulancesByHospitalId(hospitalId));
    }
}
