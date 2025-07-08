package com.REACT.backend.policeService.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PoliceStationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stationName;

    @Column(columnDefinition = "GEOGRAPHY(Point,4326)")
    private Point location;

    private int availableOfficers;

    private Instant lastUpdated;
}
