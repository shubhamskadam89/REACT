package com.REACT.backend.fireService.service.impl;
import com.REACT.backend.fireService.dto.FireStationDto;
import com.REACT.backend.fireService.model.FireStationEntity;
import com.REACT.backend.fireService.repository.FireStationRepository;
import com.REACT.backend.fireService.service.FireStationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
@Slf4j
@Service
@RequiredArgsConstructor
public class FireStationServiceImpl implements FireStationService {

    private final FireStationRepository fireStationRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory(); // reuse this

    @Override
    public FireStationDto addFireStation(FireStationDto dto) {
        Point location = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));

        FireStationEntity entity = FireStationEntity.builder()
                .stationName(dto.getName())
                .location(location)
                .build();

        FireStationEntity saved = fireStationRepository.save(entity);

        dto.setId(saved.getId());
        return dto;
    }


}