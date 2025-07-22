package com.REACT.backend.auth.dto;

import lombok.Data;

@Data
public class ResetPasswordDto {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}