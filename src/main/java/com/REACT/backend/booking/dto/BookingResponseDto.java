package com.REACT.backend.booking.dto;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.model.FireTruckEntity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
