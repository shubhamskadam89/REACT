package com.REACT.backend.booking.service;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.BookingLogRepository;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.util.DispatchUtils;
import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

    private static final int MAX_RADIUS_KM = 40;

    @Transactional
    public void acceptBooking(Long bookingId, Long driverId) {
        EmergencyRequestEntity request = requestRepo.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + bookingId));

        if (request.getDriver() == null || !request.getDriver().getUserId().equals(driverId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This booking is not assigned to this driver");
        }

        AmbulanceEntity ambulance = request.getAmbulance();
        if (ambulance.getDriver() == null) {
            throw new RuntimeException("Assigned ambulance has no driver available.");
        }

        if (!ambulance.getStatus().equals(AmbulanceStatus.PENDING_ACCEPTANCE)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is not in PENDING_ACCEPTANCE state");
        }

        ambulance.setStatus(AmbulanceStatus.EN_ROUTE);
        ambulance.setLastUpdated(Instant.now());
        ambulanceRepository.save(ambulance);

        request.setEmergencyRequestStatus(EmergencyRequestStatus.IN_PROGRESS);
        requestRepo.save(request);

        logRepo.findByEmergencyRequest_Id(bookingId).ifPresentOrElse(log -> {
            log.setStatusMessage("Booking accepted by driver: " + driverId);
            log.setAssignedAmbulance(ambulance);
            log.setCreatedAt(Instant.now());
            logRepo.save(log);
        }, () -> {
            BookingLogEntity log = BookingLogEntity.builder()
                    .createdAt(Instant.now())
                    .statusMessage("Booking accepted by driver: " + driverId)
                    .emergencyRequest(request)
                    .assignedAmbulance(ambulance)
                    .build();
            logRepo.save(log);
        });
    }

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto, Long requestedById) {
        Point userLocation = locationUtils.createPoint(requestDto.getLatitude(), requestDto.getLongitude());

        List<AmbulanceEntity> assignedAmbulances = assignAmbulances(requestDto);
        Map<String, Integer> assignedPoliceMap = assignPolice(requestDto);
        List<FireTruckEntity> assignedFireTrucks = assignFireTrucks(requestDto);

        AppUser requestedBy = userRepository.findById(requestedById)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + requestedById));

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

        if (!assignedAmbulances.isEmpty()) {
            AmbulanceEntity firstAmbulance = assignedAmbulances.get(0);
            requestEntity.setAmbulance(firstAmbulance);

            if (firstAmbulance.getDriver() != null) {
                requestEntity.setDriver(firstAmbulance.getDriver());
            } else {
                throw new RuntimeException("Assigned ambulance has no driver available.");
            }
        }

        requestRepo.save(requestEntity);

        assignedAmbulances.forEach(amb -> {
            amb.setStatus(AmbulanceStatus.PENDING_ACCEPTANCE);
            amb.setAssignedRequest(requestEntity);
            amb.setLastUpdated(Instant.now());
            ambulanceRepository.save(amb);
        });

        assignedFireTrucks.forEach(truck -> {
            truck.setStatus(FireTruckStatus.EN_ROUTE);
            truck.setLastUpdated(Instant.now());
            fireTruckRepository.save(truck);
        });

        assignedPoliceMap.forEach((stationName, count) -> {
            policeStationRepository.findByStationName(stationName).ifPresent(station -> {
                station.setAvailableOfficers(station.getAvailableOfficers() - count);
                station.setLastUpdated(Instant.now());
                policeStationRepository.save(station);
            });
        });

        String ambStatus = DispatchUtils.ambulanceStatus(
                assignedAmbulances.size(), requestDto.getRequestedAmbulanceCount()
        );
        String policeStatus = DispatchUtils.policeStatus(
                assignedPoliceMap.values().stream().mapToInt(i -> i).sum(),
                requestDto.getRequestedPoliceCount()
        );
        String fireStatus = DispatchUtils.fireTruckStatus(
                assignedFireTrucks.size(), requestDto.getRequestedFireTruckCount()
        );

        BookingLogEntity log = BookingLogEntity.builder()
                .createdAt(Instant.now())
                .statusMessage("Ambulance: " + ambStatus + ", Police: " + policeStatus + ", Fire: " + fireStatus)
                .emergencyRequest(requestEntity)
                .assignedAmbulance(assignedAmbulances.isEmpty() ? null : assignedAmbulances.get(0))
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

        return BookingResponseDto.builder()
                .ambulanceStatus(ambStatus)
                .assignedAmbulances(assignedAmbulances.stream().map(amb ->
                        com.REACT.backend.ambulanceService.dto.AmbulanceDto.builder()
                                .id(amb.getId())
                                .ambulanceNumberPlate(amb.getAmbulanceNumberPlate())
                                .ambulanceDriverName(amb.getAmbulanceDriverName())
                                .status(amb.getStatus().toString())
                                .latitude(((Point) amb.getLocation()).getY())
                                .longitude(((Point) amb.getLocation()).getX())
                                .build()).toList())
                .policeStatus(policeStatus)
                .assignedPoliceMap(assignedPoliceMap)
                .fireTruckStatus(fireStatus)
                .assignedFireTrucks(assignedFireTrucks.stream().map(truck ->
                        com.REACT.backend.fireService.dto.FireTruckDto.builder()
                                .id(truck.getId())
                                .registrationNumber(truck.getRegistrationNumber())
                                .driverName(truck.getDriverName())
                                .status(truck.getStatus().toString())
                                .lastUpdated(truck.getLastUpdated())
                                .latitude(((Point) truck.getLocation()).getY())
                                .longitude(((Point) truck.getLocation()).getX())
                                .build()).toList())
                .notes(requestDto.getNotes())
                .victimPhoneNumber(requestDto.isForSelf() ? null : requestDto.getVictimPhoneNumber())
                .issueType(requestDto.getIssueType())
                .build();
    }

    private List<AmbulanceEntity> assignAmbulances(BookingRequestDto requestDto) {
        if (!requestDto.isNeedAmbulance()) return List.of();
        return findNearestAmbulances(
                requestDto.getLatitude(),
                requestDto.getLongitude(),
                requestDto.getRequestedAmbulanceCount()
        );
    }

    private Map<String, Integer> assignPolice(BookingRequestDto requestDto) {
        Map<String, Integer> assignedPoliceMap = new HashMap<>();
        if (!requestDto.isNeedPolice()) return assignedPoliceMap;

        int totalAssigned = 0;
        List<PoliceStationEntity> stations = getStationsByProximity(requestDto.getLatitude(), requestDto.getLongitude());
        int required = requestDto.getRequestedPoliceCount();
        for (PoliceStationEntity station : stations) {
            int available = station.getAvailableOfficers();
            if (available > 0) {
                int assignCount = Math.min(required - totalAssigned, available);
                assignedPoliceMap.put(station.getStationName(), assignCount);
                totalAssigned += assignCount;
                if (totalAssigned >= required) break;
            }
        }
        return assignedPoliceMap;
    }

    private List<FireTruckEntity> assignFireTrucks(BookingRequestDto requestDto) {
        if (!requestDto.isNeedFireBrigade()) return List.of();
        return findAvailableFireTrucks(
                requestDto.getLatitude(),
                requestDto.getLongitude(),
                requestDto.getRequestedFireTruckCount()
        );
    }

    public List<AmbulanceEntity> findNearestAmbulances(double lat, double lng, int requiredCount) {
        List<AmbulanceEntity> assigned = new ArrayList<>();
        for (int radius = 1000; radius <= MAX_RADIUS_KM * 1000; radius += 1000) {
            List<AmbulanceEntity> ambulances = ambulanceRepository.findAvailableWithinRadius(lat, lng, radius);
            for (AmbulanceEntity amb : ambulances) {
                if (!assigned.contains(amb)) {
                    assigned.add(amb);
                    if (assigned.size() == requiredCount) return assigned;
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
            for (FireTruckEntity truck : trucks) {
                if (!assigned.contains(truck)) {
                    assigned.add(truck);
                    if (assigned.size() == requiredCount) return assigned;
                }
            }
        }
        return assigned;
    }
}
