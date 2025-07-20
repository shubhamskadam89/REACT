package com.REACT.backend.ambulanceService.service.impl;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.ambulanceService.service.AmbulanceLocationService;
import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.locationService.model.LocationBroadcastDto;
import com.REACT.backend.locationService.model.UnitType;
import com.REACT.backend.locationService.service.LocationBroadcastService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class AmbulanceLocationServiceImplementation implements AmbulanceLocationService {

    private final AmbulanceRepository ambulanceRepositoryRepo;
    private final LocationUtils locationUtils;
    private final LocationBroadcastService broadcastService;


    @Override
    @Transactional
    public void updateLocation(AmbulanceLocationUpdateDto dto){
        log.info("Received location update for Ambulance ID: {}, lat: {}, long: {}",
                dto.getAmbulanceId(), dto.getLatitude(), dto.getLongitude());
        AmbulanceEntity entity = ambulanceRepositoryRepo.findById(dto.getAmbulanceId())
                .orElseThrow(()-> new RuntimeException("No such ambulance exist"+dto.getAmbulanceId()));


        entity.setLocation(locationUtils.createPoint( dto.getLongitude(), dto.getLatitude()));
        ambulanceRepositoryRepo.save(entity);
        log.debug("Ambulance ID {} location updated in DB.", entity.getId());

        LocationBroadcastDto broadcastDto = new LocationBroadcastDto(
                entity.getId(),
                UnitType.AMBULANCE,
                dto.getLongitude(),
                dto.getLatitude()
        );
        broadcastService.broadcastLocation(broadcastDto);
        log.info("Location broadcasted for Ambulance ID: {}", entity.getId());
    }


    public AmbulanceDto getAmbulanceById(Long id) {
        log.info("Fetching ambulance with ID: {}", id);

        AmbulanceEntity entity = ambulanceRepositoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No such ambulance exists: " + id));

        return new AmbulanceDto(entity);
    }
}
