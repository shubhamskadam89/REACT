package com.REACT.backend.booking.dto;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.fireService.dto.FireTruckDto;
import lombok.Data;

import java.util.List;

@Data
public class BookingUnitsDto {
    private AmbulanceDto ambulance;
    private List<FireTruckDto> fireTrucks;
}