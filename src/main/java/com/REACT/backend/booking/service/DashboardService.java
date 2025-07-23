package com.REACT.backend.booking.service;

import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.booking.dto.DashboardStatsDto;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.hospitalService.repository.HospitalRepository;
import com.REACT.backend.users.repository.UserRepository;
import com.REACT.backend.users.repository.PoliceOfficerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmergencyRequestRepository emergencyRequestRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final FireTruckRepository fireTruckRepository;
    private final PoliceStationRepository policeStationRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final PoliceOfficerRepository policeOfficerRepository;

    public DashboardStatsDto getDashboardStatistics() {
        log.info("Starting dashboard statistics calculation");
        
        try {
            // Booking statistics
            log.debug("Calculating booking statistics");
            long totalBookings = emergencyRequestRepository.count();
            long ambulanceBookings = emergencyRequestRepository.countByNeedAmbulance(true);
            long fireServiceBookings = emergencyRequestRepository.countByNeedFireBrigade(true);
            long policeServiceBookings = emergencyRequestRepository.countByNeedPolice(true);
            log.debug("Booking counts - Total: {}, Ambulance: {}, Fire: {}, Police: {}", 
                    totalBookings, ambulanceBookings, fireServiceBookings, policeServiceBookings);

            // Status-based statistics
            log.debug("Calculating status-based statistics");
            long pendingBookings = emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.PENDING);
            long inProgressBookings = emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.IN_PROGRESS);
            long completedBookings = emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.COMPLETED);
            long partiallyAssignedBookings = emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.PARTIALLY_ASSIGNED);
            log.debug("Status counts - Pending: {}, In Progress: {}, Completed: {}, Partially Assigned: {}", 
                    pendingBookings, inProgressBookings, completedBookings, partiallyAssignedBookings);

            // Performance metrics
            log.debug("Calculating performance metrics");
            double averageCompletionTimeMinutes = emergencyRequestRepository.findAll().stream()
                    .filter(er -> er.getEmergencyRequestStatus() == EmergencyRequestStatus.COMPLETED)
                    .mapToLong(er -> Duration.between(er.getCreatedAt(), Instant.now()).toMinutes())
                    .average().orElse(0);
            log.debug("Average completion time: {} minutes", averageCompletionTimeMinutes);

            // Service availability statistics
            log.debug("Calculating service availability statistics");
            long totalAmbulances = ambulanceRepository.count();
            long busyAmbulances = ambulanceRepository.countByStatus(AmbulanceStatus.BUSY);
            long availableAmbulances = totalAmbulances - busyAmbulances;
            log.debug("Ambulance availability - Total: {}, Busy: {}, Available: {}", 
                    totalAmbulances, busyAmbulances, availableAmbulances);

            long totalFireTrucks = fireTruckRepository.count();
            long busyFireTrucks = fireTruckRepository.countByStatus(FireTruckStatus.BUSY);
            long availableFireTrucks = totalFireTrucks - busyFireTrucks;
            log.debug("Fire truck availability - Total: {}, Busy: {}, Available: {}", 
                    totalFireTrucks, busyFireTrucks, availableFireTrucks);

            // Infrastructure counts
            log.debug("Calculating infrastructure counts");
            long totalFireStations = fireTruckRepository.countDistinctByFireStationId();
            long totalHospitals = hospitalRepository.count();
            long totalPoliceOfficers = policeStationRepository.countTotalPoliceOfficers();
            long totalPoliceStations = policeStationRepository.count();
            long totalUsers = userRepository.count();
            log.debug("Infrastructure counts - Fire Stations: {}, Hospitals: {}, Police Officers: {}, Police Stations: {}, Users: {}", 
                    totalFireStations, totalHospitals, totalPoliceOfficers, totalPoliceStations, totalUsers);

            DashboardStatsDto stats = DashboardStatsDto.builder()
                    .timestamp(Instant.now())
                    .totalBookings(totalBookings)
                    .ambulanceBookings(ambulanceBookings)
                    .fireServiceBookings(fireServiceBookings)
                    .policeServiceBookings(policeServiceBookings)
                    .pendingBookings(pendingBookings)
                    .inProgressBookings(inProgressBookings)
                    .completedBookings(completedBookings)
                    .partiallyAssignedBookings(partiallyAssignedBookings)
                    .averageCompletionTimeMinutes(averageCompletionTimeMinutes)
                    .totalAmbulances(totalAmbulances)
                    .availableAmbulances(availableAmbulances)
                    .busyAmbulances(busyAmbulances)
                    .totalFireTrucks(totalFireTrucks)
                    .availableFireTrucks(availableFireTrucks)
                    .busyFireTrucks(busyFireTrucks)
                    .totalFireStations(totalFireStations)
                    .totalHospitals(totalHospitals)
                    .totalPoliceOfficers(totalPoliceOfficers)
                    .totalPoliceStations(totalPoliceStations)
                    .totalUsers(totalUsers)
                    .build();
                    
            log.info("Dashboard statistics calculation completed successfully");
            return stats;
            
        } catch (Exception e) {
            log.error("Error calculating dashboard statistics", e);
            throw new RuntimeException("Failed to calculate dashboard statistics", e);
        }
    }
}
