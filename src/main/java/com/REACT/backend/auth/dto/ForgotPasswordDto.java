package com.REACT.backend.auth.dto;

import lombok.Data;

@Data
public class ForgotPasswordDto {
    private String email;
    private String securityAnswer;
    private String newPassword;
}
