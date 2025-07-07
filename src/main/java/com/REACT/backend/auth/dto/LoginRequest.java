package com.REACT.backend.auth.dto;

import lombok.*;

@Getter
@Setter @NoArgsConstructor @AllArgsConstructor

public class LoginRequest {
    private String email;
    private String password;
}
