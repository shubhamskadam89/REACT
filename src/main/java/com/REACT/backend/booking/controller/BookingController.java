package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.service.BookingServiceImpl;
import com.REACT.backend.users.AppUser;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@CrossOrigin("*")
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {


    private final BookingServiceImpl bookingService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/request")
    public ResponseEntity<BookingResponseDto> handleBooking(@RequestBody BookingRequestDto requestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUser user = (AppUser) authentication.getPrincipal();

        log.info("User {} is creating a booking", user.getUserId());

        log.info("Booking request fetched from user with email: {}",user.getUserEmail());
        BookingResponseDto response = bookingService.createBooking(requestDto, user.getUserId());

        log.info("Booking created successfully: {}", response);

        return ResponseEntity.ok(response);
    }

}
