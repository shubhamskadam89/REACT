package com.REACT.backend.booking.model;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.fireService.model.FireTruckEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "booking_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"assignedPoliceMap", "assignedFireTrucks"})
public class BookingLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "emergency_request_id", unique = true)
    private EmergencyRequestEntity emergencyRequest;

    @ManyToOne
    @JoinColumn(name = "assigned_ambulance_id")
    private AmbulanceEntity assignedAmbulance;


    /**
     * stationId → number of officers assigned from that station
     */
    @ElementCollection
    @CollectionTable(
            name = "booking_log_police_allocations",
            joinColumns = @JoinColumn(name = "booking_log_id")
    )
    @MapKeyColumn(name = "station_id")
    @Column(name = "officers_assigned")
    private Map<Long, Integer> assignedPoliceMap;

    /**
     * list of individual fire trucks dispatched
     */
    @ManyToMany
    @JoinTable(
            name = "booking_log_fire_trucks",
            joinColumns = @JoinColumn(name = "booking_log_id"),
            inverseJoinColumns = @JoinColumn(name = "fire_truck_id")
    )
    private List<FireTruckEntity> assignedFireTrucks;

    @Column(length = 1024)
    private String statusMessage;

    private Instant createdAt = Instant.now();
}
