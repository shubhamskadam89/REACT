package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.service.BookingServiceImpl;
import com.REACT.backend.users.AppUser;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    private final BookingServiceImpl bookingService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/request")
    public ResponseEntity<BookingResponseDto> handleBooking(@RequestBody BookingRequestDto requestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUser user = (AppUser) authentication.getPrincipal();

        logger.info("User {} is creating a booking", user.getUserId());

        BookingResponseDto response = bookingService.createBooking(requestDto, user.getUserId());

        logger.info("Booking created successfully: {}", response);

        return ResponseEntity.ok(response);
    }

}
