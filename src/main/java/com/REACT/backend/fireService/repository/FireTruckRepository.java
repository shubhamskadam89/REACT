package com.REACT.backend.fireService.repository;

import com.REACT.backend.fireService.model.FireTruckEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FireTruckRepository extends JpaRepository<FireTruckEntity, Long> {

    @Query(value = """
        SELECT * 
        FROM fire_truck_entity f 
        WHERE f.status = 'AVAILABLE'
          AND ST_DWithin(f.location, ST_MakePoint(:lng, :lat)::geography, :radius)
        ORDER BY ST_Distance(f.location, ST_MakePoint(:lng, :lat)::geography)
        """, nativeQuery = true)
    List<FireTruckEntity> findAvailableWithinRadius(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters
    );
}
