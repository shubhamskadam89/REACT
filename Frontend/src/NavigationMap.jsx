import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function NavigationMap() {
  const { requestId, vehicleType } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showAllVehicles, setShowAllVehicles] = useState(false);

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

      if (showAllVehicles) {
        // Fetch both ambulance and fire truck data
        const [ambulanceResponse, fireTruckResponse] = await Promise.all([
          fetch(`http://localhost:8080/location-map/ambulance/${requestId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:8080/location-map/fire_truck/${requestId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const ambulanceData = ambulanceResponse.ok ? await ambulanceResponse.json() : null;
        const fireTruckData = fireTruckResponse.ok ? await fireTruckResponse.json() : null;

        const combinedData = {
          emergencyRequest: ambulanceData?.emergencyRequest || fireTruckData?.emergencyRequest,
          ambulance: ambulanceData?.ambulance,
          fireTruck: fireTruckData?.fireTruck
        };

        console.log('Combined location data:', combinedData);
        setLocationData(combinedData);
        initializeMap(combinedData);
      } else {
        // Single vehicle fetch
        const endpoint = vehicleType 
          ? `http://localhost:8080/location-map/${vehicleType}/${requestId}`
          : `http://localhost:8080/location-map/${requestId}`;
        
        const response = await fetch(endpoint, {
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
        console.log('Received location data:', data);
        setLocationData(data);
        initializeMap(data);
      }
    } catch (err) {
      console.error('API Error:', err);
      
      // Fallback to mock data for testing
      console.log('Using mock data for testing...');
      const mockData = getMockData();
      setLocationData(mockData);
      initializeMap(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    if (showAllVehicles) {
      // Mock data for both vehicles
      return {
        emergencyRequest: {
          id: parseInt(requestId),
          latitude: 18.5104,
          longitude: 73.8467
        },
        ambulance: {
          id: parseInt(requestId),
          latitude: 18.6104,
          longitude: 73.8467
        },
        fireTruck: {
          id: parseInt(requestId),
          latitude: 18.506,
          longitude: 73.809
        }
      };
    } else {
      // Mock data based on vehicle type and request ID
      if (vehicleType === 'fire_truck') {
        return {
          emergencyRequest: {
            id: parseInt(requestId),
            latitude: 18.520492,
            longitude: 73.853767
          },
          fireTruck: {
            id: parseInt(requestId),
            latitude: 18.506,
            longitude: 73.809
          }
        };
      } else {
        return {
          emergencyRequest: {
            id: parseInt(requestId),
            latitude: 18.5104,
            longitude: 73.8467
          },
          ambulance: {
            id: parseInt(requestId),
            latitude: 18.6104,
            longitude: 73.8467
          }
        };
      }
    }
  };

  const initializeMap = (data) => {
    // Load Google Maps JS API
    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCnwJl8uyVjTS8ql060q5d0az43nvVsyUw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(() => {
          createMap(data);
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(() => {
        createMap(data);
      }, 100);
    }
  };

  const createMap = (data) => {
    if (!data || !data.emergencyRequest || !data.emergencyRequest.longitude || !data.emergencyRequest.latitude) {
      setError('Invalid emergency request data received.');
      return;
    }
    const vehicleData = data.ambulance || data.fireTruck;
    if (!vehicleData || !vehicleData.longitude || !vehicleData.latitude) {
      setError('Invalid vehicle data received.');
      return;
    }
    // Center between emergency and vehicle
    const center = {
      lat: (data.emergencyRequest.latitude + vehicleData.latitude) / 2,
      lng: (data.emergencyRequest.longitude + vehicleData.longitude) / 2
    };
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center,
      zoom: 12,
      mapTypeId: 'roadmap',
    });
    // Emergency marker
    new window.google.maps.Marker({
      position: { lat: data.emergencyRequest.latitude, lng: data.emergencyRequest.longitude },
      map: mapInstance,
      title: 'Emergency Request',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FF4444',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#fff',
      },
    });
    // Ambulance marker
    if (data.ambulance) {
      new window.google.maps.Marker({
        position: { lat: data.ambulance.latitude, lng: data.ambulance.longitude },
        map: mapInstance,
        title: 'Ambulance',
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: '#44FF44',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#fff',
        },
      });
    }
    // Fire Truck marker
    if (data.fireTruck) {
      new window.google.maps.Marker({
        position: { lat: data.fireTruck.latitude, lng: data.fireTruck.longitude },
        map: mapInstance,
        title: 'Fire Truck',
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: '#FF8800',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#fff',
        },
      });
    }
    // Draw routes
    getDirections(data, mapInstance);
    setMap(mapInstance);
  };

  const getDirections = async (data, mapInstance) => {
    try {
      const routes = [];
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(data.emergencyRequest.latitude, data.emergencyRequest.longitude));
      // DirectionsService and DirectionsRenderer
      const directionsService = new window.google.maps.DirectionsService();
      // Ambulance route
      if (data.ambulance) {
        bounds.extend(new window.google.maps.LatLng(data.ambulance.latitude, data.ambulance.longitude));
        await getRouteDirections(
          data.ambulance,
          data.emergencyRequest,
          'ambulance',
          mapInstance,
          directionsService,
          routes
        );
      }
      // Fire Truck route
      if (data.fireTruck) {
        bounds.extend(new window.google.maps.LatLng(data.fireTruck.latitude, data.fireTruck.longitude));
        await getRouteDirections(
          data.fireTruck,
          data.emergencyRequest,
          'fire-truck',
          mapInstance,
          directionsService,
          routes
        );
      }
      // Calculate combined route info
      if (routes.length > 0) {
        const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0);
        const avgTime = routes.reduce((sum, route) => sum + route.duration, 0) / routes.length;
        setRouteInfo({
          distance: (totalDistance / 1000).toFixed(1),
          duration: Math.round(avgTime / 60),
          vehicleCount: routes.length
        });
      }
      mapInstance.fitBounds(bounds);
    } catch (err) {
      console.error('Error getting directions:', err);
    }
  };

  const getRouteDirections = (vehicle, emergency, vehicleType, mapInstance, directionsService, routesArr) => {
    return new Promise((resolve) => {
      const request = {
        origin: { lat: vehicle.latitude, lng: vehicle.longitude },
        destination: { lat: emergency.latitude, lng: emergency.longitude },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: vehicleType === 'ambulance' ? '#44FF44' : '#FF8800',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
      directionsService.route(request, (result, status) => {
        if (status === 'OK' && result.routes && result.routes[0]) {
          directionsRenderer.setDirections(result);
          const leg = result.routes[0].legs[0];
          routesArr.push({
            distance: leg.distance.value,
            duration: leg.duration.value,
            vehicleType,
          });
        }
        resolve();
      });
    });
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
                  <div className="text-xs text-gray-500">
                    {routeInfo.vehicleCount > 1 ? `${routeInfo.vehicleCount} Vehicles` : 
                     (locationData?.ambulance ? 'Ambulance' : 'Fire Truck')} Navigation
                  </div>
                </div>
              ) : locationData && (
                <div className="text-sm text-gray-600">
                  <div>Distance: Calculating...</div>
                  <div>ETA: Calculating...</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Toggle Button */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => {
                setShowAllVehicles(!showAllVehicles);
                setRouteInfo(null);
                setTimeout(() => fetchLocationData(), 100);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition"
            >
              {showAllVehicles ? 'Show Single Vehicle' : 'Show All Vehicles'}
            </button>
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
                <h4 className="text-sm font-medium text-gray-700">
                  {locationData.ambulance ? 'Ambulance' : 'Fire Truck'}
                </h4>
                <div className="text-xs text-gray-600">
                  <div>ID: {(locationData.ambulance || locationData.fireTruck).id}</div>
                  <div>Lat: {(locationData.ambulance || locationData.fireTruck).latitude.toFixed(6)}</div>
                  <div>Lng: {(locationData.ambulance || locationData.fireTruck).longitude.toFixed(6)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 