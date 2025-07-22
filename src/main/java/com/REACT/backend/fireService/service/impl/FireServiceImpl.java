package com.REACT.backend.fireService.service.impl;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireService;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.AmbulanceDriver;
import com.REACT.backend.users.model.FireTruckDriver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FireServiceImpl  implements FireService {
      private final FireTruckRepository fireTruckRepository;
      private final EmergencyRequestRepository emergencyRequestRepo;


    public LocationDto getLocationOfCurrentBooking(Object driverObject) {
        log.info("Location fetch request init");
         FireTruckDriver driver = (FireTruckDriver) driverObject;
        AppUser appUser = driver.getDriver();
        log.info("found user who is requesting {}",appUser.getUserEmail());
        FireTruckEntity truck = fireTruckRepository.findByDriver(driver);
        log.info("Found associated fire truck {} of {} ",truck.getVehicleRegNumber(),truck.getDriverName());

        List<EmergencyRequestEntity> activeEntity= emergencyRequestRepo.findByAssignedFireTruckEntities(truck);
        log.info("Fetched {} requests where Fire Truck where involved.",activeEntity.size());

        return activeEntity.stream()
                .filter(req -> FireTruckStatus.EN_ROUTE.equals(req.getFireTruckStatusMap().get(truck)))
                .findFirst()
                .map(req -> new LocationDto(req.getLatitude(), req.getLongitude()))
                .orElseThrow(() -> new RuntimeException("No active EN_ROUTE request for this fire truck"));


    }

    public CompleteAssignmentResponseDto completeBooking(Object obj){
        log.info("Started with COMPLETE status update process");
        FireTruckDriver driver = (FireTruckDriver) obj;
        AppUser appUser = driver.getDriver();
        FireTruckEntity truck = fireTruckRepository.findByDriver(driver);
        log.info("found ambulance {}",truck.getFireTruckId());

        truck.setStatus(FireTruckStatus.AVAILABLE);

        fireTruckRepository.save(truck);

        List<EmergencyRequestEntity> entity = emergencyRequestRepo.findByAssignedFireTruckEntities(truck);
        EmergencyRequestEntity thisEntity = null;

        for(EmergencyRequestEntity e : entity){
            FireTruckStatus status = e.getFireTruckStatusMap().get(truck);
            if(status==FireTruckStatus.EN_ROUTE){
                thisEntity = e;
                break;
            }
        }
        thisEntity.getFireTruckStatusMap().put(truck,FireTruckStatus.COMPLETED);
        log.info("Completed the assignment {}",thisEntity.getId());
        emergencyRequestRepo.save(thisEntity);

        Duration duration = Duration.between(thisEntity.getCreatedAt(), Instant.now());
        long time = duration.toMinutes();

        return CompleteAssignmentResponseDto.builder()
                .completedAt(Instant.now())
                .duration(time)
                .build();
    }



}
