package com.REACT.backend.auth.dto;

import com.REACT.backend.users.Role;
import com.REACT.backend.users.model.SecurityQuestion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "Security question must be provided")
    private SecurityQuestion securityQuestion;

    @NotBlank(message = "Security answer must be provided")
    private String securityAnswer;

}
