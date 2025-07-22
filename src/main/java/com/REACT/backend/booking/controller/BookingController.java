package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.service.BookingServiceImpl;
import com.REACT.backend.users.AppUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingServiceImpl bookingService;

    @PostMapping("/request")
    public ResponseEntity<BookingResponseDto> handleBooking(@RequestBody BookingRequestDto requestDto) {
        // 🔒 Get currently authenticated user

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUser user = (AppUser) authentication.getPrincipal(); // Cast it to your AppUser

        log.info("Booking request fetched from user with email: {}",user.getUserEmail());
        BookingResponseDto response = bookingService.createBooking(requestDto, user.getUserId());

        return ResponseEntity.ok(response);
    }




}

