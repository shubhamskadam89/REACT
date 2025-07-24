import React, { useEffect, useState, useRef } from 'react';
// If you use dotenv or Vite, you can use import.meta.env.VITE_MAPBOX_TOKEN or process.env.REACT_APP_MAPBOX_TOKEN
const MAPBOX_TOKEN ='pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

const mockProfile = {
  name: 'Jane Smith',
  phone: '+91 9876543211',
  avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=f97316&color=fff&size=128',
};
const mockHistory = [
  { id: 1, date: '2025-07-23', status: 'Completed', from: '18.53, 73.81', to: '18.54, 73.82' },
  { id: 2, date: '2025-07-22', status: 'Completed', from: '18.51, 73.80', to: '18.52, 73.83' },
  { id: 3, date: '2025-07-21', status: 'Cancelled', from: '18.50, 73.79', to: '18.53, 73.84' },
];

export default function FireTruckDriverPage() {
  const [appointment, setAppointment] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [slideValue, setSlideValue] = useState(0);
  const [sliderAnimating, setSliderAnimating] = useState(false);
  const sliderRef = useRef();
  const [routeInfo, setRouteInfo] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

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
        const res = await fetch('http://localhost:8080/fire/truck-driver/v1/current-request', {
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
    setSliderAnimating(false);
    setLoading(true);
    setError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/fire/truck-driver/v1/complete-booking', {
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

  // Watch slider value for auto-complete
  useEffect(() => {
    if (slideValue === 100 && !completed && !loading) {
      setSliderAnimating(true);
      setTimeout(() => {
        handleComplete();
      }, 800); // Animation duration
    }
  }, [slideValue, completed, loading]);

  // Fetch route info when both locations are available
  useEffect(() => {
    if (!userLocation || !appointment) return;
    const getRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${appointment.longitude},${appointment.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          setRouteInfo({
            distance: data.routes[0].distance / 1000, // km
            duration: data.routes[0].duration / 60, // min
            geometry: data.routes[0].geometry
          });
        }
      } catch {}
    };
    getRoute();
  }, [userLocation, appointment]);

  // Mapbox map rendering
  useEffect(() => {
    if (!window.mapboxgl || !appointment || !userLocation) return;
    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new window.mapboxgl.Map({
      container: 'firetruck-map',
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
    // Draw route polyline
    if (routeInfo && routeInfo.geometry) {
      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeInfo.geometry
          }
        });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#f97316', 'line-width': 5 }
        });
      });
    }
    return () => map.remove();
  }, [appointment, userLocation, routeInfo]);

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

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-orange-600 text-white px-6 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <img src={mockProfile.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white" />
          <div>
            <div className="font-bold text-lg">{mockProfile.name}</div>
            <div className="text-sm opacity-80">{mockProfile.phone}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded text-white font-semibold transition">Logout</button>
      </header>
      <div className="flex flex-1 w-full max-w-5xl mx-auto">
        {/* Sidebar/Menu */}
        <nav className="w-48 min-w-[140px] bg-orange-50 border-r border-orange-100 flex flex-col py-6 gap-2">
          <button onClick={() => setActivePage('dashboard')} className={`text-left px-4 py-2 rounded font-semibold transition ${activePage === 'dashboard' ? 'bg-orange-500 text-white' : 'hover:bg-orange-100 text-orange-700'}`}>Dashboard</button>
          <button onClick={() => setActivePage('history')} className={`text-left px-4 py-2 rounded font-semibold transition ${activePage === 'history' ? 'bg-orange-500 text-white' : 'hover:bg-orange-100 text-orange-700'}`}>Booking History</button>
          <button onClick={() => setActivePage('profile')} className={`text-left px-4 py-2 rounded font-semibold transition ${activePage === 'profile' ? 'bg-orange-500 text-white' : 'hover:bg-orange-100 text-orange-700'}`}>Profile</button>
        </nav>
        {/* Main Content */}
        <main className="flex-1 p-6">
          {activePage === 'dashboard' && (
            <>
              <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🚒</span>
                  <h1 className="text-2xl font-bold text-orange-700">Fire Truck Driver Dashboard</h1>
                </div>
                <button
                  onClick={() => window.location.href = '/fire-dashboard'}
                  className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition border border-orange-200"
                >
                  Go to Fire Admin
                </button>
              </div>
              {error && <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 w-full text-center">{error}</div>}
              {loading && <div className="mb-4 text-blue-600">Loading...</div>}
              {appointment && userLocation && (
                <div className="w-full mb-6">
                  <div id="firetruck-map" className="w-full h-80 rounded-lg shadow border mb-4" />
                </div>
              )}
              {appointment && (
                <div className="mb-6 w-full">
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg mb-2">
                    <div className="font-semibold text-gray-800 mb-1">Appointment Location:</div>
                    <div className="font-mono text-lg text-orange-700">{appointment.latitude}, {appointment.longitude}</div>
                  </div>
                  {userLocation && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-1">Your Location:</div>
                      <div className="font-mono text-lg text-blue-700">{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</div>
                    </div>
                  )}
                </div>
              )}
              {routeInfo && (
                <div className="mb-4 w-full flex flex-col items-center">
                  <div className="flex gap-4 items-center mb-2">
                    <span className="text-orange-700 font-semibold">Distance: {routeInfo.distance.toFixed(2)} km</span>
                    <span className="text-orange-700 font-semibold">Time: {Math.round(routeInfo.duration)} min</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${appointment.latitude},${appointment.longitude}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition mb-2"
                  >
                    Open in Google Maps
                  </a>
                </div>
              )}
              {!completed ? (
                <div className="flex flex-col items-center w-full">
                  <div className="mb-4 w-full flex flex-col items-center">
                    <label className="block text-gray-700 font-medium mb-2">Slide to Complete</label>
                    <input
                      ref={sliderRef}
                      type="range"
                      min="0"
                      max="100"
                      value={slideValue}
                      onChange={e => setSlideValue(Number(e.target.value))}
                      disabled={loading || completed}
                      className={`w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 transition-all duration-300 ${sliderAnimating ? 'bg-green-300' : ''}`}
                      style={{ accentColor: '#f97316' }}
                    />
                    <div className="flex justify-between w-64 text-xs mt-1">
                      <span>Start</span>
                      <span>End</span>
                    </div>
                    {sliderAnimating && (
                      <div className="flex items-center mt-2 text-green-600 animate-bounce">
                        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Completed!
                      </div>
                    )}
                    {loading && (
                      <div className="flex items-center mt-2 text-orange-600">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        Processing...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-100 text-green-700 rounded border border-green-200 font-semibold w-full text-center">Booking marked as completed!</div>
              )}
            </>
          )}
          {activePage === 'history' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-orange-700">Booking History</h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistory.map(h => (
                    <tr key={h.id} className="border-b last:border-b-0">
                      <td className="px-4 py-2 text-center">{h.id}</td>
                      <td className="px-4 py-2 text-center">{h.date}</td>
                      <td className={`px-4 py-2 text-center font-semibold ${h.status === 'Completed' ? 'text-green-600' : 'text-red-500'}`}>{h.status}</td>
                      <td className="px-4 py-2 text-center">{h.from}</td>
                      <td className="px-4 py-2 text-center">{h.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activePage === 'profile' && (
            <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4 text-orange-700">Profile</h2>
              <div className="flex flex-col items-center gap-4">
                <img src={mockProfile.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-orange-500" />
                <div className="font-bold text-lg">{mockProfile.name}</div>
                <div className="text-gray-600">{mockProfile.phone}</div>
                <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 transition">Edit Profile</button>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Add fade-in animation style */}
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