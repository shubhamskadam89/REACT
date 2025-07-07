package com.REACT.backend.ambulanceService.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor @NoArgsConstructor @ToString
@Builder
public class AmbulanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ambulanceNumberPlate;

    private String ambulanceDriverName;

    private AmbulanceStatus status;

    private double latitude;
    private  double longitude;

    private Instant lastUpdated;



}
