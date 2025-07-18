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

    /**
     * Register normal user
     * @param  request {RegisterRequestdto}
     * @return AuthResponse
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByGovernmentId(request.getGovernmentId())) {
            log.error("User with same government id exist {}",request.getGovernmentId());
            throw new RuntimeException("User already exists with this Government ID");
        }

        if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
            log.error("User with same phone number  exist {}",request.getPhoneNumber());
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
                .verified(true)  // You can make this false if email verification is needed
                .build();

        AppUser savedUser = userRepo.save(newUser);

        String token = jwtUtils.generateTokenFromEmail(savedUser);

        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getUserEmail())
                .userId(savedUser.getUserId())
                .role(savedUser.getRole())
                .userType(savedUser.getUserType())
                .build();
    }


    /**
     *  Register Fire Driver
     * @param request registerRequest
     * @return authResponse
     */
    public AuthResponse registerFireDriver(FireDriverRegisterRequestDto request){
        if (userRepo.existsByGovernmentId(request.getGovernmentId())) {
            log.error("User with same government id exist {}",request.getGovernmentId());
            throw new RuntimeException("User already exists with this Government ID");
        }

        if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
            log.error("User with same phone number  exist {}",request.getPhoneNumber());
            throw new RuntimeException("Phone number already registered");
        }

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
                .orElseThrow(() -> new RuntimeException("Station does not exist with id:"+request.getFireStationId()));


        FireTruckEntity fireTruckEntity = FireTruckEntity.builder()
                .driverName(request.getFullName())
                .status(FireTruckStatus.AVAILABLE)
                .lastUpdated(Instant.now().plusSeconds(330*3600))
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

        String token = jwtUtils.generateTokenFromEmail(savedUser);

        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getUserEmail())
                .userId(savedUser.getUserId())
                .role(savedUser.getRole())
                .build();
    }


    /**
     * Register Ambulance Driver
     * @param request registerRequest
     * @return authResponse
     */

    public AuthResponse registerAmbulanceDriver(AmbulanceRegisterRequestDto request) {

        if (userRepo.existsByGovernmentId(request.getGovernmentId())) {
            log.error("User with same government id exist {}",request.getGovernmentId());
            throw new RuntimeException("User already exists with this Government ID");
        }

        if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
            log.error("User with same phone number  exist {}",request.getPhoneNumber());
            throw new RuntimeException("Phone number already registered");
        }

        AppUser user = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(Role.AMBULANCE_DRIVER)
                .verified(true)
                .build();


        System.out.println("HospitalID:"+request.getHospitalID());
        Hospital hospital = hospitalRepo.findById(request.getHospitalID())
                .orElseThrow(()-> new RuntimeException("No hospital with this id exist: "+request.getHospitalID()));


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


        return AuthResponse.builder()
                .token(jwtUtils.generateTokenFromEmail(savedUser))
                .email(savedUser.getUserEmail())
                .userId(savedUser.getUserId())
                .role(savedUser.getRole())
                .build();
    }


    /**
     * Register Police Officer
     * @param request registerRequest
     * @return authResponse
     */
    public AuthResponse registerPoliceOfficer(PoliceOfficerRegisterRequestDto request){
        if (userRepo.existsByGovernmentId(request.getGovernmentId())) {
            log.error("User with same government id exist {}",request.getGovernmentId());
            throw new RuntimeException("User already exists with this Government ID");
        }

        if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
            log.error("User with same phone number  exist {}",request.getPhoneNumber());
            throw new RuntimeException("Phone number already registered");
        }

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
                .orElseThrow(()-> new RuntimeException("No such Police Station exist"));

        PoliceOfficer officer = PoliceOfficer.builder()
                .fullName(request.getFullName())
                .policeStation(station)
                .policeOfficer(user)
                .build();

        AppUser savedUser = userRepo.save(user);
        policeOfficerRepo.save(officer);

        return AuthResponse.builder()
                .token(jwtUtils.generateTokenFromEmail(savedUser))
                .email(savedUser.getUserEmail())
                .userId(savedUser.getUserId())
                .role(savedUser.getRole())
                .build();
    }


    public AuthResponse login(LoginRequest request) {

        AppUser user = userRepo.findByUserEmail(request.getEmail());
        log.debug("Login request from {}",request.getEmail());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
            log.error("Invalid email or password");
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateTokenFromEmail(user);

        return AuthResponse.builder()
                .token(token)
                .email(user.getUserEmail())
                .userId(user.getUserId())
                .role(user.getRole())
                .build();
    }
}
