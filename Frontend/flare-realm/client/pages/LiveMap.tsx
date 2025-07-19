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

export default function LiveMap({ patientCoords, ambulanceCoords }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!patientCoords) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [patientCoords.longitude, patientCoords.latitude],
      zoom: 13,
    });

    // Patient Home Marker (custom home icon)
    const homeEl = document.createElement('div');
    homeEl.innerHTML = homeSVG;
    homeEl.style.transform = 'translate(-50%, -100%)';
    new mapboxgl.Marker({ element: homeEl })
      .setLngLat([patientCoords.longitude, patientCoords.latitude])
      .setPopup(new mapboxgl.Popup().setText('Patient Home'))
      .addTo(map);

    // Ambulance Marker (custom ambulance icon)
    if (ambulanceCoords) {
      const ambulanceEl = document.createElement('div');
      ambulanceEl.innerHTML = ambulanceSVG;
      ambulanceEl.style.transform = 'translate(-50%, -100%)';
      new mapboxgl.Marker({ element: ambulanceEl })
        .setLngLat([ambulanceCoords.longitude, ambulanceCoords.latitude])
        .setPopup(new mapboxgl.Popup().setText('Ambulance'))
        .addTo(map);

      // Draw route from ambulance to patient
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${ambulanceCoords.longitude},${ambulanceCoords.latitude};${patientCoords.longitude},${patientCoords.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => {
          const route = data.routes[0].geometry;

          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          });

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#080500', 'line-width': 3 }
          });
        });
    }

    return () => map.remove();
  }, [patientCoords, ambulanceCoords]);

  return <div ref={mapContainer} className="w-full h-96 rounded-xl shadow" />;
} 