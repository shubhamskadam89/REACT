package com.REACT.backend.booking.dto;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;

import com.REACT.backend.fireService.dto.FireTruckDto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDto {

    private String ambulanceStatus;
    private List<AmbulanceDto> assignedAmbulances;
    private String policeStatus;
    private Map<String, Integer> assignedPoliceMap;
    private String fireTruckStatus;
    private List<FireTruckDto> assignedFireTrucks;
    private String notes;
    private String victimPhoneNumber;
    private String issueType;

}
