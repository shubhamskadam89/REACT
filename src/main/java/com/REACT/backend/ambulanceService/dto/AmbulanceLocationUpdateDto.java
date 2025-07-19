package com.REACT.backend.ambulanceService.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor@Builder
@Getter
@Setter
public class AmbulanceLocationUpdateDto {

    private Long ambulanceId;
    private double latitude;
    private double longitude;
}
