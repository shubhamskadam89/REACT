package com.REACT.backend.fireService.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FireStationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stationName;

    private double latitude;

    private double longitude;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    private List<FireTruckEntity> fireTrucks;
}
