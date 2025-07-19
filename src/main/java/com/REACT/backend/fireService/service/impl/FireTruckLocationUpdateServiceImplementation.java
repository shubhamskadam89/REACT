package com.REACT.backend.fireService.service.impl;


import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.fireService.dto.FireTruckLocationUpdateDto;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireTruckLocationUpdateService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FireTruckLocationUpdateServiceImplementation implements FireTruckLocationUpdateService {



    private final FireTruckRepository fireTruckRepo;
    private final LocationUtils locationUtils;


    @Override
    @Transactional
    public void updateLocation(FireTruckLocationUpdateDto locationUpdateDto) {

      FireTruckEntity entity = fireTruckRepo.findById(locationUpdateDto.getTruckId())
              .orElseThrow(()-> new RuntimeException("No such fire Truck Exist"+locationUpdateDto.getTruckId()));


      entity.setLocation(locationUtils.createPoint(locationUpdateDto.getLongitude(),locationUpdateDto.getLatitude()));
      fireTruckRepo.save(entity);
    }


}
