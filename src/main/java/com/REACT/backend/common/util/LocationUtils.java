package com.REACT.backend.common.util;

import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Component;

@Component
public class LocationUtils {

    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public Point createPoint(double latitude, double longitude) {
        return geometryFactory.createPoint(new Coordinate(longitude, latitude)); // Note: (lng, lat)
    }
}
