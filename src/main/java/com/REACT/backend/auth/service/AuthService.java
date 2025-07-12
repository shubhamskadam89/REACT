package com.REACT.backend.auth.service;

import com.REACT.backend.auth.dto.AuthResponse;
import com.REACT.backend.auth.dto.LoginRequest;
import com.REACT.backend.auth.dto.RegisterRequest;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.UserRepository;
import com.REACT.backend.Jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByGovernmentId(request.getGovernmentId())) {
            throw new RuntimeException("User already exists with this Government ID");
        }

        if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
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

    public AuthResponse login(LoginRequest request) {
        AppUser user = userRepo.findByUserEmail(request.getEmail());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateTokenFromEmail(user);

        return AuthResponse.builder()
                .token(token)
                .email(user.getUserEmail())
                .userId(user.getUserId())
                .role(user.getRole())
                .userType(user.getUserType())
                .build();
    }
}
