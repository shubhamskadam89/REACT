package com.REACT.backend.Navigation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationDTO {
    private Long id;
    private double latitude;
    private double longitude;
    private String issueType;
    private String notes;
}
