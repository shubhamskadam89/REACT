package com.REACT.backend.locationService.controller;

import com.REACT.backend.locationService.model.LocationBroadcastDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/location")
public class LocationUpdateController {

    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/update")
    public void receiveLocation(@RequestBody LocationBroadcastDto locationBroadcastDto) {
        messagingTemplate.convertAndSend("/topic/location", locationBroadcastDto); // push to clients
    }
}
