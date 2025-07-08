package com.REACT.backend.booking.service;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;

public interface BookingService {
    /**
     * Core entry point for any booking—HTTP API or NLP hook.
     *
     * @param requestDto     user’s booking details
     * @param requestedById  AppUser.userId of the caller
     * @return fully-populated response DTO
     */
    BookingResponseDto createBooking(BookingRequestDto requestDto, Long requestedById);
}
