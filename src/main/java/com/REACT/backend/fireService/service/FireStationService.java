package com.REACT.backend.fireService.service;

import com.REACT.backend.fireService.dto.FireStationDto;
import com.REACT.backend.fireService.dto.FireStationResponseDto;

import java.util.List;

public interface FireStationService {
    FireStationDto addFireStation(FireStationDto dto);

    List<FireStationResponseDto> getAllFireStations();

}