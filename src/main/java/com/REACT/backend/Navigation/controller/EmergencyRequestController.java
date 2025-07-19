package com.REACT.backend.Navigation.controller;

import com.REACT.backend.Navigation.dto.LocationDTO;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyRequestController {

    private static final Logger logger = LoggerFactory.getLogger(EmergencyRequestController.class);

    private final EmergencyRequestRepository repository;

    @GetMapping("/locations")
    public List<LocationDTO> getLocations(
            @RequestParam(name = "status", defaultValue = "PENDING") EmergencyRequestStatus status) {

        logger.info("Fetching emergency requests with status: {}", status);

        List<EmergencyRequestEntity> requests = repository.findByEmergencyRequestStatus(status);

        logger.debug("Found {} requests for status {}", requests.size(), status);

        List<LocationDTO> result = requests.stream()
                .map(req -> new LocationDTO(
                        req.getId(),
                        req.getLatitude(),
                        req.getLongitude(),
                        req.getIssueType(),
                        req.getNotes()
                ))
                .toList();

        logger.info("Returning {} location DTOs", result.size());

        return result;
    }

}
