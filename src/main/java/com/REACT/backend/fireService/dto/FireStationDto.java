package com.REACT.backend.fireService.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class FireStationDto {
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
}
