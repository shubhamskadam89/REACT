package com.REACT.backend.booking.model;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.users.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

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


    private boolean isForSelf;

    private String victimPhoneNumber;

    private String issueType;

    private boolean needAmbulance;
    private boolean needPolice;
    private int requestedPoliceCount;
    private boolean needFireBrigade;
    private int requestedFireTruckCount;
    private int requestedAmbulancesCount;

    @Column(length = 1024)
    private String notes;


    private double latitude;
    private double longitude;

    @Enumerated(EnumType.STRING)
    private EmergencyRequestStatus emergencyRequestStatus = EmergencyRequestStatus.PENDING;

    private Instant createdAt = Instant.now().plusSeconds(330*3600);

    @ElementCollection
    @CollectionTable(
            name = "booking_log_police_allocations",
            joinColumns = @JoinColumn(name = "booking_log_id")
    )
    @MapKeyColumn(name = "station_name")
    @Column(name = "officers_assigned")
    private Map<PoliceStationEntity, Integer> assignedPoliceMap;


    @ManyToMany
    @JoinTable(
            name = "emergency_request_assigned_ambulances",
            joinColumns = @JoinColumn(name = "emergency_request_id"),
            inverseJoinColumns = @JoinColumn(name = "ambulance_id")
    )
    private List<AmbulanceEntity> assignedAmbulances;

    @ManyToMany
    @JoinTable(
            name = "emergency_request_assigned_fire_trucks",
            joinColumns = @JoinColumn(name = "emergency_request_id"),
            inverseJoinColumns = @JoinColumn(name = "fire_truck_id")
    )
    private List<FireTruckEntity> assignedFireTrucks;


}
