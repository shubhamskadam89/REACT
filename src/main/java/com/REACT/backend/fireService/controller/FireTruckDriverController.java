package com.REACT.backend.fireService.controller;


import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.fireService.dto.FireTruckLocationUpdateDto;
import com.REACT.backend.fireService.service.FireService;
import com.REACT.backend.fireService.service.impl.FireServiceImpl;
import com.REACT.backend.fireService.service.impl.FireTruckLocationUpdateServiceImplementation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/fire/truck-driver/v1")
@RequiredArgsConstructor
public class FireTruckDriverController {

    @Autowired
    private final FireTruckLocationUpdateServiceImplementation fireTruckLocationUpdateServiceImplementation;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private final LoggedUserUtil loggedUserUtil;

    @Autowired
    private final FireServiceImpl fireService;

    @PostMapping("/update-location")
    public ResponseEntity<String> updateLocation(@Valid @RequestBody FireTruckLocationUpdateDto dto) {
        fireTruckLocationUpdateServiceImplementation.updateLocation(dto);
        log.info("Location update request fetched for fire truck {}",dto.getTruckId());
        messagingTemplate.convertAndSend("/topic/location", dto);
        return ResponseEntity.ok("Location updated and broadcasted");
    }

    @GetMapping("/current-request")
    @PreAuthorize("hasAuthority('FIRE_DRIVER') or hasAuthority('ROLE_FIRE_STATION_ADMIN')")
    public ResponseEntity<LocationDto> getBookingLocation(){
        log.info("Location fetched request for ");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        LocationDto response= fireService.getLocationOfCurrentBooking(driver);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/complete-booking")
    @PreAuthorize("hasAuthority('FIRE_DRIVER') or hasAuthority('ROLE_FIRE_STATION_ADMIN')")
    public ResponseEntity<CompleteAssignmentResponseDto> completeBooking(){
        log.info("Status update COMPLETE request fetched:");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        return ResponseEntity.ok(fireService.completeBooking(driver));
    }



}
