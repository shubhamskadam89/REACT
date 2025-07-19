package com.REACT.backend.auth.Controller;

import com.REACT.backend.auth.dto.*;
import com.REACT.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    @GetMapping("/home")
    public String homeTrial(){
        return "Hola amigo";
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        log.info("register requested fetched for userEmail {} for Role: {} ",request.getEmail(),request.getRole());
        AuthResponse response = authService.register(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/fire-driver")
    public ResponseEntity<AuthResponse> registerFireDriver(@RequestBody FireDriverRegisterRequestDto request){
        log.info("register requested fetched for userEmail {} for Role: {} ",request.getEmail(),request.getRole());
        AuthResponse response = authService.registerFireDriver(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/ambulance-driver")
    public ResponseEntity<AuthResponse> registerAmbulanceDriver(@RequestBody AmbulanceRegisterRequestDto request){
        log.info("register requested fetched for userEmail {} for Role: {} ",request.getEmail(),request.getRole());
        AuthResponse response = authService.registerAmbulanceDriver(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/police-officer")
    public ResponseEntity<AuthResponse> registerPoliceOfficer(@RequestBody PoliceOfficerRegisterRequestDto request){
        log.info("register requested fetched for userEmail {} for Role: {} ",request.getEmail(),request.getRole());
        AuthResponse response = authService.registerPoliceOfficer(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("Login requested fetched for userEmail {}",request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

}
