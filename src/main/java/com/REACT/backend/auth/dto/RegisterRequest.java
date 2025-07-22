package com.REACT.backend.auth.dto;

import com.REACT.backend.users.Role;
import com.REACT.backend.users.UserType;
import com.REACT.backend.users.model.SecurityQuestion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder

public class RegisterRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String governmentId;
    private String password;

    private Role role = Role.USER;  // Optional override
    @NotNull(message = "Security question must be provided")
    private SecurityQuestion securityQuestion;

    @NotBlank(message = "Security answer must be provided")
    private String securityAnswer;

}


