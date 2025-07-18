package com.REACT.backend.ambulanceService.service.impl;

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
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AmbulanceLocationServiceImplementation implements AmbulanceLocationService {

    private final AmbulanceRepository ambulanceRepositoryRepo;
    private final LocationUtils locationUtils;
    private final LocationBroadcastService broadcastService;


    @Override
    @Transactional
    public void updateLocation(AmbulanceLocationUpdateDto dto){
        AmbulanceEntity entity = ambulanceRepositoryRepo.findById(dto.getAmbulanceId())
                .orElseThrow(()-> new RuntimeException("No such ambulance exist"+dto.getAmbulanceId()));


        entity.setLocation(locationUtils.createPoint( dto.getLongitude(), dto.getLatitude()));
        ambulanceRepositoryRepo.save(entity);

        LocationBroadcastDto broadcastDto = new LocationBroadcastDto(
                entity.getId(),
                UnitType.AMBULANCE,
                dto.getLongitude(),
                dto.getLatitude()
        );
        broadcastService.broadcastLocation(broadcastDto);
    }


}
