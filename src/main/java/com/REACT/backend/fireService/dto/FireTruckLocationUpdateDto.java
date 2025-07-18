package com.REACT.backend.fireService.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class FireTruckLocationUpdateDto {
    private Long truckId;
    private double latitude;
    private double longitude;
}
