package com.REACT.backend.fireService.model;

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
@Table(name = "")
public class FireTruckEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String registrationNumber;

    private String driverName;

    @Enumerated(EnumType.STRING)
    private FireTruckStatus status;

    private Instant lastUpdated;

    @Column(columnDefinition = "GEOGRAPHY(Point,4326)")
    private Point location;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private FireStationEntity station;

}
