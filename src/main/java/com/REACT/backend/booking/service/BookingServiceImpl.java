package com.REACT.backend.booking.service;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.BookingLogRepository;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.util.DispatchUtils;
import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireService;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.policeService.service.PoliceService;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final LocationUtils locationUtils;
    private final AmbulanceRepository ambulanceRepository;
    private final PoliceStationRepository policeStationRepository;
    private final FireTruckRepository fireTruckRepository;
    private final UserRepository userRepository;


    private final EmergencyRequestRepository requestRepo;
    private final BookingLogRepository logRepo;

    private final AmbulanceService ambulanceService;
    private final PoliceService policeService;
    private final FireService fireService;


    private static final int MAX_RADIUS_KM = 10;

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto, Long requestedById) {

        Point userLocation = locationUtils.createPoint(requestDto.getLatitude(), requestDto.getLongitude());

        // 🏥 1. Assign ambulances
        List<AmbulanceEntity> assignedAmbulances = new ArrayList<>();
        if (requestDto.isNeedAmbulance()) {
            assignedAmbulances = findNearestAmbulances(
                    requestDto.getLatitude(),
                    requestDto.getLongitude(),
                    requestDto.getRequestedAmbulanceCount()
            );

        }


        // 🚓 2. Assign police
        Map<String, Integer> assignedPoliceMap = new HashMap<>();
        int totalAssignedOfficers = 0;
        if (requestDto.isNeedPolice()) {
            List<PoliceStationEntity> stations = getStationsByProximity(requestDto.getLatitude(), requestDto.getLongitude());
            int required = requestDto.getRequestedPoliceCount();
            for (PoliceStationEntity station : stations) {
                int available = station.getAvailableOfficers();
                if (available > 0) {
                    int assignCount = Math.min(required - totalAssignedOfficers, available);
                    assignedPoliceMap.put(station.getStationName(), assignCount); // ✅ use name
                    totalAssignedOfficers += assignCount;
                    if (totalAssignedOfficers >= required) break;
                }
            }
        }

        // 🔥 3. Assign fire trucks
        List<FireTruckEntity> assignedFireTrucks = new ArrayList<>();
        if (requestDto.isNeedFireBrigade()) {
            assignedFireTrucks = findAvailableFireTrucks(
                    requestDto.getLatitude(),
                    requestDto.getLongitude(),
                    requestDto.getRequestedFireTruckCount()
            );

        }


        // 👮‍♂️ 4. Resolve user
        AppUser requestedBy = userRepository.findById(requestedById)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestedById));

        // 📌 5. Save Emergency Request
        EmergencyRequestEntity requestEntity = EmergencyRequestEntity.builder()
                .latitude(requestDto.getLatitude())
                .longitude(requestDto.getLongitude())
                .issueType(requestDto.getIssueType())
                .needAmbulance(requestDto.isNeedAmbulance())
                .needPolice(requestDto.isNeedPolice())
                .needFireBrigade(requestDto.isNeedFireBrigade())
                .requestedFireTruckCount(requestDto.getRequestedFireTruckCount())
                .requestedPoliceCount(requestDto.getRequestedPoliceCount())
                .isForSelf(requestDto.isForSelf())
                .victimPhoneNumber(requestDto.isForSelf() ? null : requestDto.getVictimPhoneNumber())
                .notes(requestDto.getNotes())
                .emergencyRequestStatus(EmergencyRequestStatus.PENDING)
                .requestedBy(requestedBy)
                .createdAt(Instant.now())
                .build();

        requestRepo.save(requestEntity);

        // 🧯 6. Update statuses
        assignedAmbulances.forEach(amb -> {
            amb.setStatus(AmbulanceStatus.EN_ROUTE);
            amb.setLastUpdated(Instant.now());
            ambulanceRepository.save(amb);
        });

        assignedFireTrucks.forEach(truck -> {
            truck.setStatus(FireTruckStatus.EN_ROUTE);
            truck.setLastUpdated(Instant.now());
            fireTruckRepository.save(truck);
        });

        // Update police station availability

        assignedPoliceMap.forEach((stationName, count) -> {
            policeStationRepository.findByStationName(stationName).ifPresent(station -> {
                station.setAvailableOfficers(station.getAvailableOfficers() - count);
                station.setLastUpdated(Instant.now());
                policeStationRepository.save(station);
            });
        });


        // ✅ 7. Compute status messages
        String ambStatus = DispatchUtils.ambulanceStatus(
                assignedAmbulances.size(), requestDto.getRequestedAmbulanceCount()
        );
        String policeStatus = DispatchUtils.policeStatus(
                totalAssignedOfficers, requestDto.getRequestedPoliceCount()
        );
        String fireStatus = DispatchUtils.fireTruckStatus(
                assignedFireTrucks.size(), requestDto.getRequestedFireTruckCount()
        );

        // 📖 8. Booking log
        BookingLogEntity log = BookingLogEntity.builder()
                .createdAt(Instant.now())
                .statusMessage("Ambulance: " + ambStatus + ", Police: " + policeStatus + ", Fire: " + fireStatus)
                .emergencyRequest(requestEntity)
                .assignedAmbulance(assignedAmbulances.isEmpty() ? null : assignedAmbulances.get(0)) // keep for now
                .build();

        BookingLogEntity savedLog = logRepo.save(log);

        assignedFireTrucks.forEach(truck ->
                logRepo.insertFireTruckToLog(savedLog.getId(), truck.getId())
        );

        assignedPoliceMap.forEach((stationName, count) -> {
            policeStationRepository.findByStationName(stationName).ifPresent(station -> {
                logRepo.insertPoliceAllocation(savedLog.getId(), station.getId(), count);
            });
        });
        // 🧾 9. Build response
        return BookingResponseDto.builder()
                .ambulanceStatus(ambStatus)
                .assignedAmbulances(
                        assignedAmbulances.stream().map(amb -> AmbulanceDto.builder()
                                .id(amb.getId())
                                .ambulanceNumberPlate(amb.getAmbulanceNumberPlate())
                                .ambulanceDriverName(amb.getAmbulanceDriverName())
                                .status(amb.getStatus().toString())
                                .latitude(((Point) amb.getLocation()).getY())
                                .longitude(((Point) amb.getLocation()).getX())
                                .build()).toList()
                )
                .policeStatus(policeStatus)
                .assignedPoliceMap(assignedPoliceMap)
                .fireTruckStatus(fireStatus)
                .assignedFireTrucks(
                        assignedFireTrucks.stream().map(truck -> FireTruckDto.builder()
                                .id(truck.getId())
                                .registrationNumber(truck.getRegistrationNumber())
                                .driverName(truck.getDriverName())
                                .status(truck.getStatus().toString())
                                .lastUpdated(truck.getLastUpdated())
                                .latitude(((Point) truck.getLocation()).getY())
                                .longitude(((Point) truck.getLocation()).getX())
                                .build()).toList()
                )
                .notes(requestDto.getNotes())
                .victimPhoneNumber(requestDto.isForSelf() ? null : requestDto.getVictimPhoneNumber())
                .issueType(requestDto.getIssueType())
                .build();
    }

    // 🔍 Helper Methods

    public List<AmbulanceEntity> findNearestAmbulances(double lat, double lng, int requiredCount) {
        List<AmbulanceEntity> assigned = new ArrayList<>();
        for (int radius = 1000; radius <= MAX_RADIUS_KM * 1000; radius += 1000) {
            List<AmbulanceEntity> ambulances = ambulanceRepository.findAvailableWithinRadius(lat, lng, radius);
            System.out.println("🚑 Found " + ambulances.size() + " ambulances within radius " + radius);

            for (AmbulanceEntity amb : ambulances) {
                if (!assigned.contains(amb)) {
                    assigned.add(amb);
                    if (assigned.size() == requiredCount) {
                        return assigned;
                    }
                }
            }
        }
        return assigned;
    }


    public List<PoliceStationEntity> getStationsByProximity(double lat, double lng) {
        return policeStationRepository.findAllByProximity(lat, lng);
    }

    public List<FireTruckEntity> findAvailableFireTrucks(double lat, double lng, int requiredCount) {
        List<FireTruckEntity> assigned = new ArrayList<>();
        for (int radius = 1000; radius <= MAX_RADIUS_KM * 1000; radius += 1000) {
            List<FireTruckEntity> trucks = fireTruckRepository.findAvailableWithinRadius(lat, lng, radius);
            System.out.println("🚑 Found " + trucks.size() + " ambulances within radius " + radius);
            for (FireTruckEntity truck : trucks) {
                if (!assigned.contains(truck)) {
                    assigned.add(truck);
                    if (assigned.size() == requiredCount) {
                        return assigned;
                    }
                }
            }
        }
        return assigned;
    }

    private String determineStatus(int assigned, int requested) {
        if (requested == 0) return "N/A";
        if (assigned == 0) return "NONE";
        if (assigned < requested) return "PARTIAL";
        return "FULL";
    }


}
