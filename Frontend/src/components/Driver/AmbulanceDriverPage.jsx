import React, { useEffect, useState, useRef } from 'react';
import { FaAmbulance, FaPhoneAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import { MdAccessTime, MdCloud, MdAssignment, MdLocalHospital } from 'react-icons/md';
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

function getProfileFromJWT() {
  try {
    const jwt = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!jwt) return null;
    const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return {
      name: payload.name || payload.sub || 'Unknown',
      phone: payload.phone || payload.phoneNumber || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || payload.sub || 'User')}&background=2563eb&color=fff&size=128`,
    };
  } catch {
    return null;
  }
}

const mockProfile = {
  name: 'John Doe',
  phone: '+91 9876543210',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff&size=128',
};

const profile = getProfileFromJWT() || mockProfile;
const mockHistory = [
  { id: 1, date: '2025-07-23', status: 'Completed', from: '18.53, 73.81', to: '18.54, 73.82' },
  { id: 2, date: '2025-07-22', status: 'Completed', from: '18.51, 73.80', to: '18.52, 73.83' },
  { id: 3, date: '2025-07-21', status: 'Cancelled', from: '18.50, 73.79', to: '18.53, 73.84' },
];

// Animated Section Header
function SectionHeader({ icon, title }) {
  return (
    <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
      <span className="text-3xl">{icon}</span>
      {title}
    </h2>
  );
}

export default function AmbulanceDriverPage() {
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
  
  // New dashboard features
  const [completionSlideIn, setCompletionSlideIn] = useState(false);
  const [shiftStartTime] = useState('06:00 AM');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [vehicleStatus] = useState({
    ambulanceId: 'AMB-001',
    fuelLevel: 85,
    maintenanceStatus: 'Good',
    lastService: '15 days ago'
  });
  const [weatherInfo] = useState({
    temperature: '24°C',
    condition: 'Clear',
    humidity: '65%'
  });
  const [performanceMetrics] = useState({
    callsCompleted: 12,
    averageResponseTime: '8.5 min',
    patientsSaved: 45,
    rating: 4.8
  });

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

  // Handle completion PATCH request with sliding animation
  const handleComplete = async () => {
    setSliderAnimating(false);
    setCompletionSlideIn(true);
    setLoading(true);
    setError('');
    
    // Wait for slide-in animation
    setTimeout(async () => {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        setCompletionSlideIn(false);
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
        setCompletionSlideIn(false);
      }
    }, 1000);
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
          paint: { 'line-color': '#2563eb', 'line-width': 5 }
        });
      });
    }
    return () => map.remove();
  }, [appointment, userLocation, routeInfo]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary via-accent to-secondary/80 animate-fade-in">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-primary text-white px-6 py-3 shadow-md animate-fade-in">
        <div className="flex items-center gap-3">
          <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white" />
          <div>
            <div className="font-bold text-lg">{profile.name}</div>
            <div className="text-sm opacity-80 flex items-center gap-1"><FaPhoneAlt className="inline mr-1" />{profile.phone}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-secondary hover:bg-accent px-4 py-2 rounded text-white font-semibold transition">Logout</button>
      </header>
      <div className="flex flex-1 w-full max-w-5xl mx-auto animate-fade-in">
        {/* Sidebar/Menu */}
        <nav className="w-48 min-w-[140px] bg-white/80 border-r border-blue-100 flex flex-col py-6 gap-2 backdrop-blur-md animate-fade-in">
          <button onClick={() => setActivePage('dashboard')} className={`text-left px-4 py-2 rounded font-semibold transition-all ${activePage === 'dashboard' ? 'bg-primary text-white scale-105' : 'hover:bg-accent/20 text-primary'}`}>Dashboard</button>
          <button onClick={() => setActivePage('history')} className={`text-left px-4 py-2 rounded font-semibold transition-all ${activePage === 'history' ? 'bg-primary text-white scale-105' : 'hover:bg-accent/20 text-primary'}`}>Booking History</button>
          <button onClick={() => setActivePage('profile')} className={`text-left px-4 py-2 rounded font-semibold transition-all ${activePage === 'profile' ? 'bg-primary text-white scale-105' : 'hover:bg-accent/20 text-primary'}`}>Profile</button>
        </nav>
        {/* Main Content */}
        <main className="flex-1 p-6 animate-fade-in">
          {activePage === 'dashboard' && (
            <>
              <div className="flex items-center justify-between w-full mb-6">
                <div className="flex items-center gap-2">
                  <FaAmbulance className="text-3xl text-blue-700" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow">Ambulance Driver Dashboard</h1>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Current Time</div>
                  <div className="text-lg font-bold text-blue-700">{currentTime.toLocaleTimeString()}</div>
                </div>
              </div>
              
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Shift Started</div>
                      <div className="text-xl font-bold text-blue-800">{shiftStartTime}</div>
                    </div>
                    <MdAccessTime className="text-3xl text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-600 font-medium">Status</div>
                      <div className="text-xl font-bold text-green-800">On Duty</div>
                    </div>
                    <FaCheckCircle className="text-3xl text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-purple-600 font-medium">Calls Today</div>
                      <div className="text-xl font-bold text-purple-800">{performanceMetrics.callsCompleted}</div>
                    </div>
                    <FaPhoneAlt className="text-3xl text-purple-600" />
                  </div>
                </div>
              </div>
              
              {/* Vehicle Status Card */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 border border-cyan-200 rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <FaAmbulance className="text-3xl text-cyan-700" />
                  <h3 className="text-xl font-bold text-cyan-800">Vehicle Status - {vehicleStatus.ambulanceId}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-700">{vehicleStatus.fuelLevel}%</div>
                    <div className="text-sm text-cyan-600">Fuel Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{vehicleStatus.maintenanceStatus}</div>
                    <div className="text-sm text-cyan-600">Maintenance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{vehicleStatus.lastService}</div>
                    <div className="text-sm text-cyan-600">Last Service</div>
                  </div>
                </div>
              </div>
              
              {/* Weather and Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:rotate-1 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <MdCloud className="text-3xl text-amber-700" />
                    <h3 className="text-xl font-bold text-amber-800">Weather Today</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-amber-700">{weatherInfo.temperature}</div>
                      <div className="text-sm text-amber-600">Temperature</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-700">{weatherInfo.condition}</div>
                      <div className="text-sm text-amber-600">Condition</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-700">{weatherInfo.humidity}</div>
                      <div className="text-sm text-amber-600">Humidity</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-rotate-1 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <MdAssignment className="text-3xl text-indigo-700" />
                    <h3 className="text-xl font-bold text-indigo-800">Today's Performance</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-indigo-700">{performanceMetrics.averageResponseTime}</div>
                      <div className="text-sm text-indigo-600">Avg Response</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-indigo-700">{performanceMetrics.patientsSaved}</div>
                      <div className="text-sm text-indigo-600">Patients Helped</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-yellow-600 flex items-center"><FaStar className="mr-1" />{performanceMetrics.rating}</div>
                      <div className="text-sm text-indigo-600">Rating</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-indigo-700">{performanceMetrics.callsCompleted}</div>
                      <div className="text-sm text-indigo-600">Calls Done</div>
                    </div>
                  </div>
                </div>
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
              {routeInfo && (
                <div className="mb-4 w-full flex flex-col items-center">
                  <div className="flex gap-4 items-center mb-2">
                    <span className="text-blue-700 font-semibold">Distance: {routeInfo.distance.toFixed(2)} km</span>
                    <span className="text-blue-700 font-semibold">Time: {Math.round(routeInfo.duration)} min</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${appointment.latitude},${appointment.longitude}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-2"
                  >
                    Open in Google Maps
                  </a>
                </div>
              )}
              {!completed ? (
                <div className="flex flex-col items-center w-full relative">
                  {/* Sliding completion overlay */}
                  {completionSlideIn && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl transform animate-slide-in-right z-10">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Completing Request...
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4 w-full flex flex-col items-center">
                    <label className="block text-gray-700 font-medium mb-2">Slide to Complete</label>
                    <div className="w-72 p-4 bg-blue-50 rounded-2xl shadow flex flex-col items-center relative transition-all duration-300">
                      <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max="100"
                        value={slideValue}
                        onChange={e => setSlideValue(Number(e.target.value))}
                        disabled={loading || completed}
                        className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all duration-300 ${sliderAnimating ? 'bg-green-300' : ''}`}
                        style={{ accentColor: '#3b82f6' }}
                      />
                      {/* Custom thumb with arrow */}
                      <style>{`
                        input[type='range']::-webkit-slider-thumb {
                          -webkit-appearance: none;
                          appearance: none;
                          width: 40px;
                          height: 40px;
                          border-radius: 8px;
                          background: #2563eb;
                          box-shadow: 0 2px 8px rgba(37,99,235,0.15);
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          transition: background 0.2s;
                          position: relative;
                        }
                        input[type='range']:focus::-webkit-slider-thumb {
                          outline: 2px solid #2563eb;
                        }
                        input[type='range']::-webkit-slider-thumb::before {
                          content: '';
                          display: block;
                          position: absolute;
                          left: 12px;
                          top: 10px;
                          width: 0;
                          height: 0;
                          border-top: 10px solid transparent;
                          border-bottom: 10px solid transparent;
                          border-left: 18px solid #fff;
                        }
                        input[type='range']::-webkit-slider-thumb::after {
                          display: none;
                        }
                        input[type='range']::-moz-range-thumb {
                          width: 40px;
                          height: 40px;
                          border-radius: 8px;
                          background: #2563eb;
                          box-shadow: 0 2px 8px rgba(37,99,235,0.15);
                          border: none;
                          position: relative;
                        }
                        input[type='range']:focus::-moz-range-thumb {
                          outline: 2px solid #2563eb;
                        }
                        input[type='range']::-moz-range-thumb {
                          background: #2563eb url('data:image/svg+xml;utf8,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><polygon points="6,4 20,12 6,20" fill="white"/></svg>') no-repeat center center;
                          background-size: 24px 24px;
                        }
                        /* Hide the default arrow for Firefox */
                        input[type='range']::-moz-focus-outer { border: 0; }
                      `}</style>
                      <div className="flex justify-between w-full text-xs mt-2">
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
                        <div className="flex items-center mt-2 text-blue-600">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          Processing...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-100 text-green-700 rounded border border-green-200 font-semibold w-full text-center">Booking marked as completed!</div>
              )}
            </>
          )}
          {activePage === 'history' && (
            <div className="bg-white rounded-xl shadow p-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Booking History</h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-blue-50">
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
            <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto animate-fade-in">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Profile</h2>
              <div className="flex flex-col items-center gap-4">
                <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-600" />
                <div className="font-bold text-lg">{profile.name}</div>
                <div className="text-gray-600 flex items-center gap-1"><FaPhoneAlt className="inline mr-1" />{profile.phone}</div>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Edit Profile</button>
              </div>
            </div>
          )}
        </main>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-slide-in-right {
          animation: slideInRight 1s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 