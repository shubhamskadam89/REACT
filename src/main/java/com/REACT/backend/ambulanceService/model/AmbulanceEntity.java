package com.REACT.backend.ambulanceService.model;

import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.users.AppUser;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor @NoArgsConstructor @ToString
@Builder

@Table(name = "ambulance_entity")
public class AmbulanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ambulanceNumberPlate;

    private String ambulanceDriverName;

    @Enumerated(EnumType.STRING)
    private AmbulanceStatus status;

    @Column(columnDefinition = "GEOGRAPHY(Point,4326)")
    private Point location;

    private Instant lastUpdated;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private AppUser driver;

    @ManyToOne
    @JoinColumn(name = "assigned_request_id")
    private EmergencyRequestEntity assignedRequest;



}
