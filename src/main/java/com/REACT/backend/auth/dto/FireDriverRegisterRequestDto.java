package com.REACT.backend.auth.dto;

import com.REACT.backend.users.Role;

import lombok.*;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FireDriverRegisterRequestDto {

    private String fullName;
    private String email;
    private String phoneNumber;
    private String governmentId;
    private String password;

    private Role role = Role.FIRE_DRIVER;
    private String licenseNumber;

    private String vehicleRegNumber;
    private Long fireStationId;
}
