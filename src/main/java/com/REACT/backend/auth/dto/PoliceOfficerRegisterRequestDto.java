package com.REACT.backend.auth.dto;

import com.REACT.backend.users.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PoliceOfficerRegisterRequestDto {


    private String fullName;
    private String email;
    private String phoneNumber;
    private String governmentId;
    private String password;
    private Role role = Role.POLICE_OFFICER;
    private Long policeStationId;
}
