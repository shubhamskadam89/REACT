package com.REACT.backend.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ResetPasswordDto {
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters long")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    @Size(min = 6, message = "Confirm password must be at least 6 characters long")
    private String confirmPassword;
}