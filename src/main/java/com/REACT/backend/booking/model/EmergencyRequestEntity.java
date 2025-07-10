package com.REACT.backend.booking.model;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.users.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "emergency_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class EmergencyRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "requested_by_id")
    private AppUser requestedBy;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private AppUser driver;


    @ManyToOne
    @JoinColumn(name = "ambulance_id")
    private AmbulanceEntity ambulance;
    private boolean isForSelf;

    private String victimPhoneNumber;

    private String issueType;

    private boolean needAmbulance;
    private boolean needPolice;
    private int requestedPoliceCount;
    private boolean needFireBrigade;
    private int requestedFireTruckCount;

    @Column(length = 1024)
    private String notes;


    private double latitude;
    private double longitude;

    @Enumerated(EnumType.STRING)
    private EmergencyRequestStatus emergencyRequestStatus = EmergencyRequestStatus.PENDING;

    private Instant createdAt = Instant.now();
}
