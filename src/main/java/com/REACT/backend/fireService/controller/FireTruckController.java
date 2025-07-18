package com.REACT.backend.fireService.controller;


import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceLocationServiceImplementation;
import com.REACT.backend.fireService.dto.FireTruckLocationUpdateDto;
import com.REACT.backend.fireService.service.impl.FireTruckLocationUpdateServiceImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fire/location")
@RequiredArgsConstructor
public class FireTruckController {

    @Autowired
    FireTruckLocationUpdateServiceImplementation fireTruckLocationUpdateServiceImplementation;
    private final SimpMessagingTemplate messagingTemplate;



    @PostMapping("/update")
    public ResponseEntity<String> updateLocation(@RequestBody FireTruckLocationUpdateDto dto) {
        fireTruckLocationUpdateServiceImplementation.updateLocation(dto);
        System.out.println("Received Location: " + dto);

        // Then broadcast to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/location", dto);
        return ResponseEntity.ok("Location updated and broadcasted");
    }

}
