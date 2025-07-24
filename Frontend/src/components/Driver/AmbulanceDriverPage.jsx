import React, { useEffect, useState } from 'react';
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

export default function AmbulanceDriverPage() {
  const [appointment, setAppointment] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  // Fetch assigned appointment location
  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/ambulance-driver/v1/get/current-request/location', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAppointment(data);
        } else {
          const data = await res.json();
          setError(data.message || 'Failed to fetch appointment location.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, []);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      () => setError('Unable to retrieve your location.'),
      { enableHighAccuracy: true }
    );
  }, []);

  // Handle completion PATCH request
  const handleComplete = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/ambulance-driver/v1/complete-booking', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCompleted(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to complete booking.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mapbox map rendering
  useEffect(() => {
    if (!window.mapboxgl || !appointment || !userLocation) return;
    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new window.mapboxgl.Map({
      container: 'ambulance-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [appointment.longitude, appointment.latitude],
      zoom: 13
    });
    // Add markers
    new window.mapboxgl.Marker({ color: 'red' })
      .setLngLat([appointment.longitude, appointment.latitude])
      .setPopup(new window.mapboxgl.Popup().setText('Appointment Location'))
      .addTo(map);
    new window.mapboxgl.Marker({ color: 'blue' })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(new window.mapboxgl.Popup().setText('Your Location'))
      .addTo(map);
    return () => map.remove();
  }, [appointment, userLocation]);

  // Load Mapbox GL JS script if not present
  useEffect(() => {
    if (window.mapboxgl) return;
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => {};
    document.body.appendChild(script);
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border p-6 mb-8 flex flex-col items-center animate-fade-in">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚑</span>
            <h1 className="text-2xl font-bold text-blue-700">Ambulance Driver Dashboard</h1>
          </div>
          {/* Removed admin button for driver-only page */}
        </div>
        {error && <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 w-full text-center">{error}</div>}
        {loading && <div className="mb-4 text-blue-600">Loading...</div>}
        {appointment && userLocation && (
          <div className="w-full mb-6">
            <div id="ambulance-map" className="w-full h-80 rounded-lg shadow border mb-4" />
          </div>
        )}
        {appointment && (
          <div className="mb-6 w-full">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-2">
              <div className="font-semibold text-gray-800 mb-1">Appointment Location:</div>
              <div className="font-mono text-lg text-blue-700">{appointment.latitude}, {appointment.longitude}</div>
            </div>
            {userLocation && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">Your Location:</div>
                <div className="font-mono text-lg text-gray-700">{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</div>
              </div>
            )}
          </div>
        )}
        {!completed ? (
          <div className="flex flex-col items-center w-full">
            <label className="flex items-center cursor-pointer mb-4 w-full justify-center">
              <span className="mr-4 text-gray-700 font-medium">Slide to Complete</span>
              <input
                type="checkbox"
                checked={slideChecked}
                onChange={e => setSlideChecked(e.target.checked)}
                className="w-14 h-7 rounded-full bg-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                style={{ accentColor: '#3b82f6' }}
              />
            </label>
            <button
              onClick={handleComplete}
              disabled={!slideChecked || loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
            >
              Mark as Completed
            </button>
          </div>
        ) : (
          <div className="p-4 bg-green-100 text-green-700 rounded border border-green-200 font-semibold w-full text-center">Booking marked as completed!</div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 