package com.REACT.backend.fireService.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FireTruckEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String registrationNumber;

    private String driverName;

    @Enumerated(EnumType.STRING)
    private FireTruckStatus status;

    private Instant lastUpdated;

    private double latitude;

    private double longitude;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private FireStationEntity station;
}
