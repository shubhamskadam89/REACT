package com.REACT.backend.booking.dto;

import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDto {
    private Long bookingId;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String issueType;
    private String status;

    public BookingDto(EmergencyRequestEntity request) {
        this.bookingId = request.getId();
        this.pickupLatitude = request.getLatitude();
        this.pickupLongitude = request.getLongitude();
        this.issueType = request.getIssueType();
        this.status = request.getEmergencyRequestStatus().name();
    }
    public BookingDto(BookingLogEntity entity) {
        this.bookingId = entity.getId();
        this.pickupLatitude = entity.getEmergencyRequest().getLatitude();
        this.pickupLongitude = entity.getEmergencyRequest().getLongitude();
        this.issueType = entity.getEmergencyRequest().getIssueType();
        this.status = entity.getEmergencyRequest().getEmergencyRequestStatus().name();
    }
}
