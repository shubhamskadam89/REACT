package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.service.BookingServiceImpl;
import com.REACT.backend.users.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingServiceImpl bookingService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/request")
    public ResponseEntity<BookingResponseDto> handleBooking(@RequestBody BookingRequestDto requestDto) {
        // 🔒 Get currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUser user = (AppUser) authentication.getPrincipal(); // Cast it to your AppUser

        BookingResponseDto response = bookingService.createBooking(requestDto, user.getUserId());

        return ResponseEntity.ok(response);
    }
    @PostMapping("/accept")
    public ResponseEntity<?> acceptBooking(@RequestParam Long bookingId, @RequestParam Long driverId) {
        try {
            bookingService.acceptBooking(bookingId, driverId);
            return ResponseEntity.ok("Booking accepted by driver " + driverId);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }



}

