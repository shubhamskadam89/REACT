import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function NavigationMap() {
  const { requestId } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    fetchLocationData();
  }, [requestId]);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get JWT token
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/location-map/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to fetch location data.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLocationData(data);
      initializeMap(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = (data) => {
    // Load Mapbox GL JS
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(link);
      
      // Initialize map after CSS is loaded
      setTimeout(() => {
        createMap(data);
      }, 100);
    };
    document.head.appendChild(script);
  };

  const createMap = (data) => {
    // You'll need to replace 'YOUR_MAPBOX_ACCESS_TOKEN' with actual token
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';
    
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [
        (data.emergencyRequest.longitude + data.ambulance.longitude) / 2,
        (data.emergencyRequest.latitude + data.ambulance.latitude) / 2
      ],
      zoom: 12
    });

    mapInstance.on('load', () => {
      // Add emergency request marker
      new mapboxgl.Marker({ color: '#FF4444' })
        .setLngLat([data.emergencyRequest.longitude, data.emergencyRequest.latitude])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Emergency Request</h3>'))
        .addTo(mapInstance);

      // Add ambulance marker
      new mapboxgl.Marker({ color: '#44FF44' })
        .setLngLat([data.ambulance.longitude, data.ambulance.latitude])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Ambulance</h3>'))
        .addTo(mapInstance);

      // Get directions
      getDirections(data, mapInstance);
    });

    setMap(mapInstance);
  };

  const getDirections = async (data, mapInstance) => {
    try {
      const start = `${data.ambulance.longitude},${data.ambulance.latitude}`;
      const end = `${data.emergencyRequest.longitude},${data.emergencyRequest.latitude}`;
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const route = await response.json();
      
      if (route.routes && route.routes.length > 0) {
        const routeData = route.routes[0];
        
        // Calculate distance and time
        const distanceInKm = (routeData.distance / 1000).toFixed(1);
        const timeInMinutes = Math.round(routeData.duration / 60);
        
        // Set route info for display
        setRouteInfo({
          distance: distanceInKm,
          duration: timeInMinutes
        });
        
        // Add the route to the map
        mapInstance.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeData.geometry
          }
        });

        mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FF6B35',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Fit map to route bounds
        const bounds = new mapboxgl.LngLatBounds();
        routeData.geometry.coordinates.forEach(coord => {
          bounds.extend(coord);
        });
        mapInstance.fitBounds(bounds, { padding: 50 });
      }
    } catch (err) {
      console.error('Error getting directions:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading navigation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchLocationData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Navigation</h1>
              <p className="text-gray-600">Emergency Request #{requestId}</p>
            </div>
            <div className="text-right">
              {routeInfo ? (
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-green-600">Distance: {routeInfo.distance} km</div>
                  <div className="font-semibold text-blue-600">ETA: {routeInfo.duration} min</div>
                </div>
              ) : locationData && (
                <div className="text-sm text-gray-600">
                  <div>Distance: Calculating...</div>
                  <div>ETA: Calculating...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div id="map" className="w-full h-screen"></div>
        
        {/* Info Panel */}
        {locationData && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Location Details</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Emergency Request</h4>
                <div className="text-xs text-gray-600">
                  <div>ID: {locationData.emergencyRequest.id}</div>
                  <div>Lat: {locationData.emergencyRequest.latitude.toFixed(6)}</div>
                  <div>Lng: {locationData.emergencyRequest.longitude.toFixed(6)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">Ambulance</h4>
                <div className="text-xs text-gray-600">
                  <div>ID: {locationData.ambulance.id}</div>
                  <div>Lat: {locationData.ambulance.latitude.toFixed(6)}</div>
                  <div>Lng: {locationData.ambulance.longitude.toFixed(6)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 