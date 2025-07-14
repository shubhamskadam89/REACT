package com.REACT.backend.fireService.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "fire_station_entity")
public class FireStationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stationName;

    @Column(columnDefinition = "GEOGRAPHY(Point,4326)")
    private Point location;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    private List<FireTruckEntity> fireTrucks;
}
