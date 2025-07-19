package com.REACT.backend.auth.service;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.auth.dto.*;
import com.REACT.backend.fireService.model.FireStationEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireStationRepository;
import com.REACT.backend.hospitalService.model.Hospital;
import com.REACT.backend.hospitalService.repository.HospitalRepository;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.users.Role;
import com.REACT.backend.users.model.AmbulanceDriver;
import com.REACT.backend.users.model.FireTruckDriver;
import com.REACT.backend.users.model.PoliceOfficer;
import com.REACT.backend.users.repository.AmbulanceDriverRepository;
import com.REACT.backend.users.repository.FireTruckDriverRepository;
import com.REACT.backend.users.repository.PoliceOfficerRepository;
import com.REACT.backend.users.repository.UserRepository;
import com.REACT.backend.Jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    private final FireStationRepository fireStationRepo;
    private final FireTruckDriverRepository fireTruckDriverRepo;

    private final AmbulanceDriverRepository ambulanceDriverRepo;
    private final HospitalRepository hospitalRepo;

    private final PoliceStationRepository policeStationRepo;
    private final PoliceOfficerRepository policeOfficerRepo;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());

        if (userRepo.existsByGovernmentId(request.getGovernmentId())) {
            log.error("Duplicate government ID: {}", request.getGovernmentId());
            throw new RuntimeException("User already exists with this Government ID");
        }

        if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
            log.error("Duplicate phone number: {}", request.getPhoneNumber());
            throw new RuntimeException("Phone number already registered");
        }

        AppUser newUser = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .userType(request.getUserType())
                .verified(true)
                .build();

        AppUser savedUser = userRepo.save(newUser);
        log.info("User registered successfully: {} (Role: {})", savedUser.getUserEmail(), savedUser.getRole());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse registerFireDriver(FireDriverRegisterRequestDto request) {
        log.info("Registering fire truck driver: {}", request.getEmail());

        checkUserConflict(request.getGovernmentId(), request.getPhoneNumber());

        AppUser newUser = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .verified(true)
                .build();

        FireStationEntity station = fireStationRepo.findById(request.getFireStationId())
                .orElseThrow(() -> {
                    log.error("No fire station with ID: {}", request.getFireStationId());
                    return new RuntimeException("Station does not exist with id:" + request.getFireStationId());
                });

        log.info("Assigning driver {} to fire station: {}", request.getFullName(), station.getStationName());

        FireTruckEntity fireTruckEntity = FireTruckEntity.builder()
                .driverName(request.getFullName())
                .status(FireTruckStatus.AVAILABLE)
                .lastUpdated(Instant.now().plusSeconds(330 * 3600))
                .location(station.getLocation())
                .fireStationEntity(station)
                .vehicleRegNumber(request.getVehicleRegNumber())
                .build();

        FireTruckDriver fireTruckDriver = FireTruckDriver.builder()
                .driver(newUser)
                .fireTruckEntity(fireTruckEntity)
                .licenseNumber(request.getLicenseNumber())
                .build();

        AppUser savedUser = userRepo.save(newUser);
        fireTruckDriverRepo.save(fireTruckDriver);
        log.info("Fire truck driver registered: {}, assigned truck: {}", savedUser.getUserEmail(), request.getVehicleRegNumber());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse registerAmbulanceDriver(AmbulanceRegisterRequestDto request) {
        log.info("Registering ambulance driver: {}", request.getEmail());

        checkUserConflict(request.getGovernmentId(), request.getPhoneNumber());

        AppUser user = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(Role.AMBULANCE_DRIVER)
                .verified(true)
                .build();

        Hospital hospital = hospitalRepo.findById(request.getHospitalID())
                .orElseThrow(() -> {
                    log.error("Invalid hospital ID: {}", request.getHospitalID());
                    return new RuntimeException("No hospital with this id exist: " + request.getHospitalID());
                });

        AmbulanceEntity ambulance = AmbulanceEntity.builder()
                .ambulanceRegNumber(request.getVehicleRegNumber())
                .ambulanceDriverName(request.getFullName())
                .status(AmbulanceStatus.AVAILABLE)
                .location(hospital.getLocation())
                .lastUpdated(Instant.now())
                .driver(user)
                .hospital(hospital)
                .build();

        AmbulanceDriver driver = AmbulanceDriver.builder()
                .driver(user)
                .ambulance(ambulance)
                .licenseNumber(request.getLicenseNumber())
                .build();

        AppUser savedUser = userRepo.save(user);
        ambulanceDriverRepo.save(driver);
        log.info("Ambulance driver registered: {}, vehicle: {}", savedUser.getUserEmail(), request.getVehicleRegNumber());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse registerPoliceOfficer(PoliceOfficerRegisterRequestDto request) {
        log.info("Registering police officer: {}", request.getEmail());

        checkUserConflict(request.getGovernmentId(), request.getPhoneNumber());

        AppUser user = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(Role.POLICE_OFFICER)
                .verified(true)
                .build();

        PoliceStationEntity station = policeStationRepo.findById(request.getPoliceStationId())
                .orElseThrow(() -> {
                    log.error("No police station found with ID: {}", request.getPoliceStationId());
                    return new RuntimeException("No such Police Station exist");
                });

        log.info("Assigning officer {} to station {}", request.getFullName(), station.getStationName());

        PoliceOfficer officer = PoliceOfficer.builder()
                .fullName(request.getFullName())
                .policeStation(station)
                .policeOfficer(user)
                .build();

        AppUser savedUser = userRepo.save(user);
        policeOfficerRepo.save(officer);
        log.info("Police officer registered: {}", savedUser.getUserEmail());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for {}", request.getEmail());

        AppUser user = userRepo.findByUserEmail(request.getEmail());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
            log.warn("Invalid login attempt for {}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }

        log.info("Login successful for {}", request.getEmail());
        return buildAuthResponse(user);
    }

    // ------------------ Helpers ------------------------

    private void checkUserConflict(String govId, String phone) {
        if (userRepo.existsByGovernmentId(govId)) {
            log.error("Duplicate government ID: {}", govId);
            throw new RuntimeException("User already exists with this Government ID");
        }

        if (userRepo.existsByPhoneNumber(phone)) {
            log.error("Duplicate phone number: {}", phone);
            throw new RuntimeException("Phone number already registered");
        }
    }

    private AuthResponse buildAuthResponse(AppUser user) {
        return AuthResponse.builder()
                .token(jwtUtils.generateTokenFromEmail(user))
                .email(user.getUserEmail())
                .userId(user.getUserId())
                .role(user.getRole())
                .userType(user.getUserType())
                .build();
    }
}
