package com.REACT.backend.fireService.dto;


import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;

import lombok.*;
import java.time.Instant;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FireTruckDto {

    private Long id;
    private String registrationNumber;
    private String driverName;
    private String driverPhoneNumber;
    private FireTruckStatus status;
    private Instant lastUpdated;
    private double latitude;
    private double longitude;
//    private FireStationDto fireStation;

    public FireTruckDto(FireTruckEntity entity) {
        this.id = entity.getFireTruckId();
        this.registrationNumber = entity.getVehicleRegNumber();
        if (entity.getDriver() != null && entity.getDriver().getDriver() != null) {
            this.driverName = entity.getDriver().getDriver().getUserFullName();
            this.driverPhoneNumber = entity.getDriver().getDriver().getPhoneNumber();
        }
        this.status = entity.getStatus();
        this.lastUpdated = entity.getLastUpdated();
        this.latitude = entity.getLocation().getY();
        this.longitude = entity.getLocation().getX();
//        if (entity.getStation() != null) {
//            this.fireStation = new FireStationDto(entity.getStation());
//        }
    }


}
