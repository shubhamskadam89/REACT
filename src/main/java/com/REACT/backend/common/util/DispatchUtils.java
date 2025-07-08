package com.REACT.backend.common.util;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;

import java.util.Optional;

public class DispatchUtils {

    private static final int NO_REQUEST = 0;

    /**
     * @return "FULL" if ambulance assigned, "NONE" otherwise
     */


    /**
     * @param assigned  how many officers were dispatched
     * @param requested how many were requested
     * @return "N/A" if none requested, otherwise "NONE"/"PARTIAL"/"FULL"
     */
    public static String policeStatus(int assigned, int requested) {
        if (requested == NO_REQUEST)   return "N/A";
        if (assigned == 0)             return "NONE";
        if (assigned < requested)      return "PARTIAL";
        return "FULL";
    }

    /**
     * @param assigned  how many fire trucks were dispatched
     * @param requested how many were requested
     * @return same logic as policeStatus but for fire trucks
     */
    public static String fireTruckStatus(int assigned, int requested) {
        if (requested == NO_REQUEST)   return "N/A";
        if (assigned == 0)             return "NONE";
        if (assigned < requested)      return "PARTIAL";
        return "FULL";
    }
    public static String ambulanceStatus(int assigned, int requested) {
        if (requested == NO_REQUEST)   return "N/A";
        if (assigned == 0)             return "NONE";
        if (assigned < requested)      return "PARTIAL";
        return "FULL";
    }

}
