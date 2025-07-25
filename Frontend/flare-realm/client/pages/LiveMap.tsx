import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

interface Coords {
  latitude: number;
  longitude: number;
}

interface LiveMapProps {
  patientCoords: Coords;
  ambulanceCoords?: Coords;
  fireTruckCoords?: Coords;
}

const homeSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#00bcd4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
`;

const ambulanceSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff9800" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="7" width="20" height="10" rx="2"/>
    <circle cx="7" cy="19" r="2"/>
    <circle cx="17" cy="19" r="2"/>
    <rect x="16" y="9" width="4" height="4" rx="1" fill="#fff"/>
    <rect x="4" y="9" width="6" height="4" rx="1" fill="#fff"/>
  </svg>
`;

const fireTruckSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#e53935" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="8" width="20" height="8" rx="2"/>
    <circle cx="7" cy="20" r="2"/>
    <circle cx="17" cy="20" r="2"/>
    <rect x="16" y="10" width="4" height="4" rx="1" fill="#fff"/>
    <rect x="4" y="10" width="6" height="4" rx="1" fill="#fff"/>
    <rect x="10" y="6" width="4" height="4" rx="1" fill="#e53935"/>
  </svg>
`;

export default function LiveMap({ patientCoords, ambulanceCoords, fireTruckCoords }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const ambulanceMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const fireTruckMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const homeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeRef = useRef<string | null>(null);
  const fireRouteRef = useRef<string | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (!patientCoords || mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [patientCoords.longitude, patientCoords.latitude],
      zoom: 13,
    });
  }, [patientCoords]);

  // Home marker (patient)
  useEffect(() => {
    if (!mapRef.current || !patientCoords) return;
    if (homeMarkerRef.current) {
      homeMarkerRef.current.setLngLat([patientCoords.longitude, patientCoords.latitude]);
    } else {
      const homeEl = document.createElement('div');
      homeEl.innerHTML = homeSVG;
      homeEl.style.transform = 'translate(-50%, -100%)';
      homeMarkerRef.current = new mapboxgl.Marker({ element: homeEl })
        .setLngLat([patientCoords.longitude, patientCoords.latitude])
        .setPopup(new mapboxgl.Popup().setText('Patient Home'))
        .addTo(mapRef.current);
    }
  }, [patientCoords]);

  // Ambulance marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (ambulanceCoords) {
      if (ambulanceMarkerRef.current) {
        ambulanceMarkerRef.current.setLngLat([ambulanceCoords.longitude, ambulanceCoords.latitude]);
      } else {
        const ambulanceEl = document.createElement('div');
        ambulanceEl.innerHTML = ambulanceSVG;
        ambulanceEl.style.transform = 'translate(-50%, -100%)';
        ambulanceMarkerRef.current = new mapboxgl.Marker({ element: ambulanceEl })
          .setLngLat([ambulanceCoords.longitude, ambulanceCoords.latitude])
          .setPopup(new mapboxgl.Popup().setText('Ambulance'))
          .addTo(mapRef.current);
      }
    } else if (ambulanceMarkerRef.current) {
      ambulanceMarkerRef.current.remove();
      ambulanceMarkerRef.current = null;
    }
  }, [ambulanceCoords]);

  // Fire truck marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (fireTruckCoords) {
      if (fireTruckMarkerRef.current) {
        fireTruckMarkerRef.current.setLngLat([fireTruckCoords.longitude, fireTruckCoords.latitude]);
      } else {
        const fireTruckEl = document.createElement('div');
        fireTruckEl.innerHTML = fireTruckSVG;
        fireTruckEl.style.transform = 'translate(-50%, -100%)';
        fireTruckMarkerRef.current = new mapboxgl.Marker({ element: fireTruckEl })
          .setLngLat([fireTruckCoords.longitude, fireTruckCoords.latitude])
          .setPopup(new mapboxgl.Popup().setText('Fire Truck'))
          .addTo(mapRef.current);
      }
    } else if (fireTruckMarkerRef.current) {
      fireTruckMarkerRef.current.remove();
      fireTruckMarkerRef.current = null;
    }
  }, [fireTruckCoords]);

  // Draw/Update ambulance route
  useEffect(() => {
    if (!mapRef.current) return;
    if (ambulanceCoords) {
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${ambulanceCoords.longitude},${ambulanceCoords.latitude};${patientCoords.longitude},${patientCoords.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => {
          const route = data.routes[0].geometry;
          if (routeRef.current && mapRef.current!.getSource(routeRef.current)) {
            (mapRef.current!.getSource(routeRef.current) as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              properties: {},
              geometry: route
            });
          } else {
            const routeId = 'route';
            routeRef.current = routeId;
            if (mapRef.current!.getLayer(routeId)) {
              mapRef.current!.removeLayer(routeId);
            }
            if (mapRef.current!.getSource(routeId)) {
              mapRef.current!.removeSource(routeId);
            }
            mapRef.current!.addSource(routeId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route
              }
            });
            mapRef.current!.addLayer({
              id: routeId,
              type: 'line',
              source: routeId,
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: { 'line-color': '#080500', 'line-width': 3 }
            });
          }
        });
    } else if (routeRef.current && mapRef.current!.getLayer(routeRef.current)) {
      mapRef.current!.removeLayer(routeRef.current);
      mapRef.current!.removeSource(routeRef.current);
      routeRef.current = null;
    }
  }, [ambulanceCoords, patientCoords]);

  // Draw/Update fire truck route
  useEffect(() => {
    if (!mapRef.current) return;
    if (fireTruckCoords) {
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${fireTruckCoords.longitude},${fireTruckCoords.latitude};${patientCoords.longitude},${patientCoords.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => {
          const route = data.routes[0].geometry;
          if (fireRouteRef.current && mapRef.current!.getSource(fireRouteRef.current)) {
            (mapRef.current!.getSource(fireRouteRef.current) as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              properties: {},
              geometry: route
            });
          } else {
            const fireRouteId = 'fireRoute';
            fireRouteRef.current = fireRouteId;
            if (mapRef.current!.getLayer(fireRouteId)) {
              mapRef.current!.removeLayer(fireRouteId);
            }
            if (mapRef.current!.getSource(fireRouteId)) {
              mapRef.current!.removeSource(fireRouteId);
            }
            mapRef.current!.addSource(fireRouteId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route
              }
            });
            mapRef.current!.addLayer({
              id: fireRouteId,
              type: 'line',
              source: fireRouteId,
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#e53935',
                'line-width': 3,
                'line-dasharray': [2, 4]
              }
            });
          }
        });
    } else if (fireRouteRef.current && mapRef.current!.getLayer(fireRouteRef.current)) {
      mapRef.current!.removeLayer(fireRouteRef.current);
      mapRef.current!.removeSource(fireRouteRef.current);
      fireRouteRef.current = null;
    }
  }, [fireTruckCoords, patientCoords]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full rounded-xl shadow" />;
} 