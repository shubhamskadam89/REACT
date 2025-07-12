package com.REACT.backend.ambulanceService.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AmbulanceDto {
    private Long id;
    private String ambulanceNumberPlate;
    private String ambulanceDriverName;
    private String status;
    private double latitude;
    private double longitude;
}

