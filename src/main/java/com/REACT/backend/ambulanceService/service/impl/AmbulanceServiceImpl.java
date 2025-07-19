package com.REACT.backend.ambulanceService.service.impl;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import  java.util.*;
import java.util.stream.Collectors;

@Service
public class AmbulanceServiceImpl implements AmbulanceService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    @Override
    public List<AmbulanceDto> getAllAmbulances() {
        return ambulanceRepository.findAll().stream()
                .map(AmbulanceDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public AmbulanceDto getAmbulanceById(Long id) {
        AmbulanceEntity entity = ambulanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ambulance not found with id: " + id));
        return new AmbulanceDto(entity);
    }

    @Override
    public List<AmbulanceDto> getAmbulancesByHospitalId(Long hospitalId) {
        return ambulanceRepository.findByHospitalId(hospitalId).stream()
                .map(AmbulanceDto::new)
                .collect(Collectors.toList());
    }




}