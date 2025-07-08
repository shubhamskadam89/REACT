package com.REACT.backend.ambulanceService.repository;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceRepository extends JpaRepository<AmbulanceEntity, Long> {

    @Query(value = """
        SELECT * 
        FROM ambulance_entity a 
        WHERE a.status = 'AVAILABLE'
          AND ST_DWithin(a.location, ST_MakePoint(:lng, :lat)::geography, :radius) 
        ORDER BY ST_Distance(a.location, ST_MakePoint(:lng, :lat)::geography)
        LIMIT 1
        """, nativeQuery = true)
    Optional<AmbulanceEntity> findNearestAvailable(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters
    );
    @Query(value = """
    SELECT * FROM ambulance_entity a
    WHERE a.status = 'AVAILABLE'
      AND ST_DWithin(a.location, ST_MakePoint(:lng, :lat)::geography, :radius)
    ORDER BY ST_Distance(a.location, ST_MakePoint(:lng, :lat)::geography)
""", nativeQuery = true)
    List<AmbulanceEntity> findAvailableWithinRadius(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radiusMeters
    );


}
