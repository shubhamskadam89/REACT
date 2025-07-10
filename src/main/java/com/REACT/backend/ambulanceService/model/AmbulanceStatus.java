package com.REACT.backend.ambulanceService.model;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum AmbulanceStatus {
    AVAILABLE,
    EN_ROUTE,
    BUSY,
    PENDING_ACCEPTANCE
}
