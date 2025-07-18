package com.REACT.backend.ambulanceService.dto;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmbulanceDto {
    private Long id;
    private String regNumber;
    private String driverName;
    private AmbulanceStatus status;
    private double latitude;
    private double longitude;
    private Instant lastUpdated;

    public AmbulanceDto(AmbulanceEntity entity) {
        this.id = entity.getId();
        this.regNumber = entity.getAmbulanceRegNumber();
        this.driverName = entity.getAmbulanceDriverName();
        this.status = entity.getStatus();
        this.lastUpdated = entity.getLastUpdated();
        if (entity.getLocation() != null) {
            this.latitude = entity.getLocation().getY();
            this.longitude = entity.getLocation().getX();
        }
    }
}
