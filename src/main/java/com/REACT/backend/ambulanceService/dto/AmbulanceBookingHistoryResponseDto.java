package com.REACT.backend.ambulanceService.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AmbulanceBookingHistoryResponseDto {
    private Long id;
    private Long userId;
    private String emailOfRequester;
    private Instant requestedAt;
    private double latitude;
    private double longitude;
}
