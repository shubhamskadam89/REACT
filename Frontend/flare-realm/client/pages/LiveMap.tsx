import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface Coords {
  latitude: number;
  longitude: number;
}

interface LiveMapProps {
  patientCoords: Coords;
  hospitalCoords: Coords;
}

const homeSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#00bcd4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
`;

const hospitalSVG = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff5252" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M12 8v8M8 12h8"/>
  </svg>
`;

export default function LiveMap({ patientCoords, hospitalCoords }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!patientCoords || !hospitalCoords) return;

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

    // Hospital Marker (custom hospital icon)
    const hospitalEl = document.createElement('div');
    hospitalEl.innerHTML = hospitalSVG;
    hospitalEl.style.transform = 'translate(-50%, -100%)';
    new mapboxgl.Marker({ element: hospitalEl })
      .setLngLat([hospitalCoords.longitude, hospitalCoords.latitude])
      .setPopup(new mapboxgl.Popup().setText('Hospital'))
      .addTo(map);

    // Fetch directions
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${patientCoords.longitude},${patientCoords.latitude};${hospitalCoords.longitude},${hospitalCoords.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
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
          paint: { 'line-color': '#00bcd4', 'line-width': 5 }
        });
      });

    return () => map.remove();
  }, [patientCoords, hospitalCoords]);

  return <div ref={mapContainer} className="w-full h-96 rounded-xl shadow" />;
} 