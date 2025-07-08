package com.REACT.backend.policeService.repository;

import com.REACT.backend.policeService.model.PoliceStationEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PoliceStationRepository extends JpaRepository<PoliceStationEntity, Long> {

    @Query(value = """
        SELECT * 
        FROM police_station_entity p
        ORDER BY ST_Distance(p.location, ST_MakePoint(:lng, :lat)::geography)
        """, nativeQuery = true)
    List<PoliceStationEntity> findAllByProximity(
            @Param("lat") double latitude,
            @Param("lng") double longitude
    );

    Optional<PoliceStationEntity> findByStationName(String stationName);

}
