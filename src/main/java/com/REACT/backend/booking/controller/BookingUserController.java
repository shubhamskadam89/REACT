package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.dto.BookingSummeryDto;
import com.REACT.backend.booking.service.BookingService;
import com.REACT.backend.users.AppUser;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;

import org.slf4j.Logger;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Slf4j
@RestController
@CrossOrigin("*")
@RequestMapping("/user")
@RequiredArgsConstructor
public class BookingUserController {

    private static final Logger logger = LoggerFactory.getLogger(BookingUserController.class);

    private final BookingService bookingService;

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/bookings/{userId}")

    public ResponseEntity<List<BookingSummeryDto>> getUserBookings(@PathVariable Long userId) {

        List<BookingSummeryDto> bookings = bookingService.getBookingHistoryForUser(userId);
        log.info("Bookings for userId {} requested",userId);
        return ResponseEntity.ok(bookings);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<BookingResponseDto> getBookingDetails(@PathVariable Long bookingId) {
        log.info("Fetching booking details for bookingId {}", bookingId);
        BookingResponseDto bookingDetails = bookingService.getBookingDetailsByBookingId(bookingId);
        log.info("Booking with {} requested ny the user",bookingId);
        return ResponseEntity.ok(bookingDetails);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/delete/{bookingId}")
    public ResponseEntity<String> deleteBookingByID(@PathVariable Long bookingId) throws AccessDeniedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUser user = (AppUser) authentication.getPrincipal();

        log.warn("User {} is attempting to delete booking {}", user.getUserId(), bookingId);


        BookingResponseDto response = bookingService.deleteBookingById(bookingId, user.getUserId());
        log.info("Booking delete request received for booking {}",bookingId);
        return ResponseEntity.ok( "Booking deleted Successfully");
    }

}
