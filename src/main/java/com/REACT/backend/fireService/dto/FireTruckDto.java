package com.REACT.backend.fireService.dto;

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
    private String status;
    private Instant lastUpdated;
    private double latitude;
    private double longitude;
}
