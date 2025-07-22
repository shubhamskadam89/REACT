package com.REACT.backend.ambulanceService.service.impl;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.AmbulanceDriver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AmbulanceDriverServiceImpl {

    private final EmergencyRequestRepository emergencyRequestRepo;
    private final AmbulanceRepository ambulanceRepository;

    public List<AmbulanceBookingHistoryResponseDto> getAllHistory(Object obj) {
        log.info("Received request to fetch ambulance booking history");

        if (!(obj instanceof AmbulanceDriver driver)) {
            log.error("Invalid user type: expected AmbulanceDriver but got {}", obj.getClass().getSimpleName());
            throw new IllegalArgumentException("User is not an AmbulanceDriver");
        }

        AmbulanceEntity ambulance = driver.getAmbulance();
        if (ambulance == null) {
            log.warn("AmbulanceDriver {} has no assigned ambulance", driver.getDriverId());
            return List.of(); // or throw, depending on your design
        }

        log.debug("Fetching booking history for ambulance ID: {}", ambulance.getId());

        List<EmergencyRequestEntity> bookings = emergencyRequestRepo.findByAssignedAmbulance(ambulance);

        log.info("Found {} bookings for ambulance ID: {}", bookings.size(), ambulance.getId());

        List<AmbulanceBookingHistoryResponseDto> response = bookings.stream()
                .map(req -> {
                    log.debug("Mapping booking ID {} to response DTO", req.getId());
                    return AmbulanceBookingHistoryResponseDto.builder()
                            .id(req.getId())
                            .userId(req.getRequestedBy().getUserId())
                            .emailOfRequester(req.getRequestedBy().getUserEmail())
                            .requestedAt(req.getCreatedAt())
                            .latitude(req.getLatitude())
                            .status(req.getAmbulanceStatusMap().get(ambulance))
                            .longitude(req.getLongitude())
                            .build();
                })
                .toList();

        log.info("Returning {} booking DTOs for response", response.size());
        return response;
    }

    // Add this method somewhere in your AmbulanceDriverServiceImpl

    public LocationDto getLocationOfCurrentBooking(Object driverObject) {
        log.info("Location fetch request init");
        AmbulanceDriver driver = (AmbulanceDriver) driverObject;
        AppUser appUser = driver.getDriver();
        log.info("found user who is requesting {}",appUser.getUserEmail());
      AmbulanceEntity ambulance = ambulanceRepository.findByDriver(appUser);
      log.info("Found associated ambulance {} of {} ",ambulance.getAmbulanceRegNumber(),ambulance.getAmbulanceDriverName());

     List< EmergencyRequestEntity> activeEntity= emergencyRequestRepo.findByAssignedAmbulance(ambulance);
     log.info("Fetched {} requests where ambulance where involved.",activeEntity.size());

     return activeEntity.stream().filter( req -> AmbulanceStatus.EN_ROUTE.equals(req.getAmbulanceStatusMap().get(ambulance)))
             .findFirst()
             .map(req -> new LocationDto(req.getLatitude(), req.getLongitude()))
             .orElseThrow(()-> new RuntimeException("No active EN_ROUTE request for this ambulance"));

    }


    public CompleteAssignmentResponseDto completeBooking(Object obj){
        log.info("Started with COMPLETE status update process");
        AmbulanceDriver driver = (AmbulanceDriver) obj;
        AppUser appUser = driver.getDriver();
        AmbulanceEntity ambulance = ambulanceRepository.findByDriver(appUser);
        log.info("found ambulance {}",ambulance.getId());
        ambulance.setStatus(AmbulanceStatus.AVAILABLE);
        ambulanceRepository.save(ambulance);
        List<EmergencyRequestEntity> entity = emergencyRequestRepo.findByAssignedAmbulance(ambulance);
        EmergencyRequestEntity thisEntity= null;
        for(EmergencyRequestEntity e: entity){
            AmbulanceStatus status = e.getAmbulanceStatusMap().get(ambulance);
            if(status==AmbulanceStatus.EN_ROUTE){
                thisEntity=e;
                break;
            }
        }
        thisEntity.getAmbulanceStatusMap().put(ambulance,AmbulanceStatus.COMPLETED);
        log.info("Completed the assignment {}",thisEntity.getId());
        emergencyRequestRepo.save(thisEntity);
        log.info("done updating status");

        Duration duration = Duration.between(thisEntity.getCreatedAt(), Instant.now());
        long time = duration.toMinutes();
        return CompleteAssignmentResponseDto.builder()
                .completedAt(Instant.now())
                .duration(time)
                .build();
    }





}
