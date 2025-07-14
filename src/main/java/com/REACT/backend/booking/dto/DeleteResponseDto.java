package com.REACT.backend.booking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Builder
@Getter
@Setter
public class DeleteResponseDto {
    private Long deletedId;
    private String message;
    private Instant deletedAt;
}