package com.REACT.backend.users;

public enum Role {
    USER,     // defualt requester
    AMBULANCE_DRIVER,      // Assigned to ambulance
    HOSPITAL_ADMINISTRATOR,
    FIRE_DRIVER,           // Handles fire truck
    FIRE_STATION_ADMIN,    // Admin of local fire station
    POLICE_OFFICER,
    SUPER_ADMIN;
}
