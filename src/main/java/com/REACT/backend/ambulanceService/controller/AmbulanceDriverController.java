package com.REACT.backend.ambulanceService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceDriverServiceImpl;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.AmbulanceDriver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/ambulance-driver/v1")
public class AmbulanceDriverController {

    private final AmbulanceDriverServiceImpl service;
    private final LoggedUserUtil loggedUserUtil;


    @GetMapping("/get-history")
    @PreAuthorize("hasAuthority('AMBULANCE_DRIVER')")
    public ResponseEntity<List<AmbulanceBookingHistoryResponseDto>> getHistory(){
        log.info("Request for all history of ambulance fetched");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        List<AmbulanceBookingHistoryResponseDto> response = service.getAllHistory(driver);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/current-request/location")
    @PreAuthorize("hasAuthority('AMBULANCE_DRIVER')")
    public ResponseEntity<LocationDto> getBookingLocation(){
        log.info("Location fetched request for ");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        LocationDto response= service.getLocationOfCurrentBooking(driver);
        return ResponseEntity.ok(response);
    }
}
