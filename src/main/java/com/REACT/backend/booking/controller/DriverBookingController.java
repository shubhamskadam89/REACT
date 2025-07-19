package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.service.DriverBookingServiceImpl;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@CrossOrigin("*")
@RequestMapping("/driver")
@RequiredArgsConstructor
public class DriverBookingController {



    private final DriverBookingServiceImpl driverBookingService;

    @PostMapping("/booking/accept")
    public ResponseEntity<String> acceptBooking(@RequestParam Long bookingId,
                                                @RequestParam Long driverId) {

        log.info("Driver {} is accepting booking {}", driverId, bookingId);

        driverBookingService.acceptBooking(bookingId, driverId);
        return ResponseEntity.ok("Booking accepted successfully!");
    }

    @GetMapping("/{driverId}/pending-requests")
    public ResponseEntity<List<BookingDto>> getPendingRequests(@PathVariable Long driverId) {
        log.info("Fetching pending requests for driver {}", driverId);
        List<EmergencyRequestEntity> pending = driverBookingService.getPendingRequestsForDriver(driverId);
        List<BookingDto> response = pending.stream().map(BookingDto::new).toList();
        return ResponseEntity.ok(response);
    }
}
