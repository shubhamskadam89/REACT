import React, { useEffect, useState, useRef } from 'react';
import { FaAmbulance, FaPhoneAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import { MdAccessTime, MdCloud, MdAssignment, MdLocalHospital, MdLocationOn } from 'react-icons/md';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// === CRITICAL CHANGE HERE ===
// Ensure HistoryIcon is NOT present, and ClockIcon IS present.
import { UserIcon, HomeIcon, ClockIcon, MapIcon as MapOutlineIcon } from '@heroicons/react/24/outline'; // Corrected import


const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFpdHJreWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

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
  { id: 1, date: '2025-07-23', status: 'Completed', from: '18.53, 73.81', to: '18.54, 73.82', issue: 'Cardiac Arrest' },
  { id: 2, date: '2025-07-22', status: 'Completed', from: '18.51, 73.80', to: '18.52, 73.83', issue: 'Road Accident' },
  { id: 3, date: '2025-07-21', status: 'Cancelled', from: '18.50, 73.79', to: '18.53, 73.84', issue: 'Minor Injury' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.02, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.08)" },
};

const completionOverlayVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: "0%", opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
  exit: { x: "-100%", opacity: 0, transition: { ease: "easeOut", duration: 0.5 } }
};

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

  const [completionSlideIn, setCompletionSlideIn] = useState(false);
  const [shiftStartTime] = useState(new Date('2025-01-07T06:00:00'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [vehicleStatus] = useState({
    ambulanceId: 'AMB-001',
    fuelLevel: 85,
    maintenanceStatus: 'Good',
    lastService: '15 days ago'
  });
  const [weatherInfo] = useState({
    temperature: 24,
    condition: 'Clear',
    humidity: 65
  });
  const [performanceMetrics] = useState({
    callsCompleted: 12,
    averageResponseTime: '8.5 min',
    patientsSaved: 45,
    rating: 4.8
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
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
          if (data) {
              toast.info('New assignment received!', { autoClose: 5000 });
          } else {
              toast.info('No active assignments.');
          }
        } else {
          const data = await res.json();
          setError(data.message || 'Failed to fetch appointment location.');
          toast.error(data.message || 'Failed to fetch appointment location.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        toast.error('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        toast.error('Geolocation is not supported by your browser.');
        return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => {
          console.error('Geolocation error:', err);
          setError(`Geolocation error: ${err.message}. Please enable location services.`);
          toast.error(`Geolocation error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleComplete = async () => {
    setSliderAnimating(false);
    setCompletionSlideIn(true);
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
        setLoading(false);
        setCompletionSlideIn(false);
        return;
      }

      const res = await fetch('http://localhost:8080/ambulance-driver/v1/complete-booking', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setCompleted(true);
        setAppointment(null);
        toast.success('Booking marked as completed!');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to complete booking.');
        toast.error(data.message || 'Failed to complete booking.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setCompletionSlideIn(false), 1500);
    }
  };

  useEffect(() => {
    if (slideValue === 100 && !completed && !loading) {
      setSliderAnimating(true);
      const timer = setTimeout(() => {
        handleComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [slideValue, completed, loading]);

  useEffect(() => {
    if (!userLocation || !appointment || !MAPBOX_TOKEN) return;
    const getRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${appointment.longitude},${appointment.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          setRouteInfo({
            distance: data.routes[0].distance / 1000,
            duration: data.routes[0].duration / 60,
            geometry: data.routes[0].geometry
          });
        }
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };
    getRoute();
  }, [userLocation, appointment, MAPBOX_TOKEN]);

  useEffect(() => {
    if (!window.mapboxgl || !appointment || !userLocation || !MAPBOX_TOKEN) return;

    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new window.mapboxgl.Map({
      container: 'ambulance-map',
      style: 'mapbox://styles/mapbox/streets-v11', // Neutral map style
      center: [appointment.longitude, appointment.latitude],
      zoom: 13
    });

    new window.mapboxgl.Marker({ color: '#dc2626' }) // Red marker for destination
      .setLngLat([appointment.longitude, appointment.latitude])
      .setPopup(new window.mapboxgl.Popup({ offset: 25 }).setText('Appointment Location'))
      .addTo(map);

    new window.mapboxgl.Marker({ color: '#2563eb' }) // Blue marker for user location
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(new window.mapboxgl.Popup({ offset: 25 }).setText('Your Location'))
      .addTo(map);

    if (routeInfo && routeInfo.geometry) {
      map.on('load', () => {
        if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }
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
          paint: { 'line-color': '#2563eb', 'line-width': 4 } // Blue route line
        });
      });
    }

    if (userLocation && appointment) {
        const bounds = new window.mapboxgl.LngLatBounds();
        bounds.extend([userLocation.longitude, userLocation.latitude]);
        bounds.extend([appointment.longitude, appointment.latitude]);
        if (routeInfo && routeInfo.geometry && routeInfo.geometry.coordinates) {
            routeInfo.geometry.coordinates.forEach(coord => {
                bounds.extend(coord);
            });
        }
        map.fitBounds(bounds, { padding: 80 });
    }

    return () => map.remove();
  }, [appointment, userLocation, routeInfo, MAPBOX_TOKEN]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.mapboxgl) return;
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
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

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const StatCard = ({ title, value, icon, className = '', iconClassName = '' }) => (
    <motion.div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`text-3xl ${iconClassName}`}>{icon}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white text-gray-800 px-6 py-3 shadow-md border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-blue-500" />
          <div>
            <div className="font-bold text-lg">{profile.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-1"><FaPhoneAlt className="inline mr-1 text-blue-500" />{profile.phone}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold transition-colors duration-200">Logout</button>
      </header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        {/* Sidebar/Menu - Enhanced Styling */}
        <nav className="w-56 min-w-[180px] bg-white border-r border-gray-200 flex flex-col py-6 px-4 gap-2 shadow-lg">
          <motion.button
            onClick={() => setActivePage('dashboard')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'dashboard' ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </motion.button>
          <motion.button
            onClick={() => setActivePage('history')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'history' ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <ClockIcon className="h-5 w-5" /> Booking History {/* Corrected to ClockIcon */}
          </motion.button>
          <motion.button
            onClick={() => setActivePage('profile')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'profile' ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserIcon className="h-5 w-5" /> Profile
          </motion.button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {activePage === 'dashboard' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="flex items-center justify-between w-full mb-6">
                <div className="flex items-center gap-3">
                  <FaAmbulance className="text-3xl text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-800">Ambulance Driver Dashboard</h1>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Current Time</div>
                  <div className="text-lg font-bold text-gray-800">{currentTime.toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Top Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard
                  title="Shift Started"
                  value={shiftStartTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}
                  icon={<MdAccessTime />}
                  iconClassName="text-blue-600"
                  className="bg-gray-100 border-gray-200"
                />
                <StatCard
                  title="Status"
                  value="On Duty"
                  icon={<FaCheckCircle />}
                  iconClassName="text-green-600"
                  className="bg-gray-100 border-gray-200"
                />
                <StatCard
                  title="Calls Today"
                  value={performanceMetrics.callsCompleted}
                  icon={<FaPhoneAlt />}
                  iconClassName="text-purple-600"
                  className="bg-gray-100 border-gray-200"
                />
              </div>

              {/* Vehicle Status Card */}
              <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaAmbulance className="text-xl text-blue-600" />
                  Vehicle Status - {vehicleStatus.ambulanceId}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <motion.div variants={itemVariants}>
                    <div className="text-2xl mb-1 text-green-600">⛽</div>
                    <p className="text-sm text-gray-600">Fuel Level</p>
                    <p className="font-bold">{vehicleStatus.fuelLevel}%</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <div className="text-2xl mb-1 text-gray-700">🔧</div>
                    <p className="text-sm text-gray-600">Maintenance</p>
                    <p className="font-bold">{vehicleStatus.maintenanceStatus}</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <div className="text-2xl mb-1 text-gray-700">🗓️</div>
                    <p className="text-sm text-gray-600">Last Service</p>
                    <p className="font-bold">{vehicleStatus.lastService}</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Weather and Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" variants={itemVariants}>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MdCloud className="text-xl text-blue-600" />
                    Weather Today
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <motion.div variants={itemVariants}>
                      <div className="text-2xl font-bold text-gray-800">{weatherInfo.temperature}°C</div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="text-2xl font-bold text-gray-800">{weatherInfo.condition}</div>
                      <div className="text-sm text-gray-600">Condition</div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="text-2xl font-bold text-gray-800">{weatherInfo.humidity}%</div>
                      <div className="text-sm text-gray-600">Humidity</div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" variants={itemVariants}>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MdAssignment className="text-xl text-blue-600" />
                    Today's Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <motion.div variants={itemVariants}>
                      <div className="text-xl font-bold text-gray-800">{performanceMetrics.averageResponseTime}</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="text-xl font-bold text-gray-800">{performanceMetrics.patientsSaved}</div>
                      <div className="text-sm text-gray-600">Patients Helped</div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="text-xl font-bold text-yellow-500 flex items-center justify-center"><FaStar className="mr-1" />{performanceMetrics.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="text-xl font-bold text-gray-800">{performanceMetrics.callsCompleted}</div>
                      <div className="text-sm text-gray-600">Calls Done</div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {error && <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 w-full text-center">{error}</div>}
              {loading && <div className="mb-4 text-blue-600 text-center">Loading...</div>}

              {appointment && userLocation ? (
                <motion.div className="w-full mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><MdLocationOn className="text-xl text-blue-600" />Current Assignment</h3>
                  {/* Map container - no explicit background color, uses Mapbox's default style */}
                  <div id="ambulance-map" className="w-full h-80 rounded-lg shadow border mb-4 relative" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-1">Appointment Location:</div>
                      <div className="font-mono text-base text-gray-700">{appointment.latitude}, {appointment.longitude}</div>
                    </div>
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-1">Your Location:</div>
                      <div className="font-mono text-base text-gray-700">{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</div>
                    </div>
                  </div>
                  {routeInfo && (
                    <div className="mt-4 flex flex-col items-center">
                      <div className="flex gap-4 items-center mb-3">
                        <span className="text-gray-700 font-semibold">Distance: {routeInfo.distance.toFixed(2)} km</span>
                        <span className="text-gray-700 font-semibold">Time: {Math.round(routeInfo.duration)} min</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${appointment.latitude},${appointment.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div className="w-full mb-6 bg-gray-100 p-6 rounded-xl shadow border border-gray-200 text-gray-700 text-center" variants={itemVariants}>
                    No active assignment at the moment. Please wait for new requests.
                </motion.div>
              )}

              {appointment && !completed ? (
                <div className="flex flex-col items-center w-full relative h-32">
                  {completionSlideIn && (
                    <motion.div
                      className="absolute inset-0 bg-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl z-10"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={completionOverlayVariants}
                    >
                      <div className="flex items-center gap-3">
                        <motion.svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                        Completing Request...
                      </div>
                    </motion.div>
                  )}

                  <motion.div className="mb-4 w-full flex flex-col items-center" variants={itemVariants}>
                    <label className="block text-gray-700 font-medium mb-2">Slide to Complete Task</label>
                    <div className="w-72 p-4 bg-gray-50 rounded-2xl shadow flex flex-col items-center relative transition-all duration-300">
                      <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max="100"
                        value={slideValue}
                        onChange={e => setSlideValue(Number(e.target.value))}
                        disabled={loading || completed || completionSlideIn}
                        className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all duration-300 ${sliderAnimating ? 'bg-green-300' : ''}`}
                        style={{ accentColor: '#2563eb' }}
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
                        <motion.div className="flex items-center mt-2 text-green-600"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Releasing control...
                        </motion.div>
                      )}
                      {loading && (
                        <motion.div className="flex items-center mt-2 text-blue-600"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          Processing...
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  className="p-4 bg-green-100 text-green-700 rounded border border-green-200 font-semibold w-full text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Booking marked as completed! Ready for next assignment.
                </motion.div>
              )}
            </motion.div>
          )}
          {activePage === 'history' && (
            <motion.div className="bg-white rounded-xl shadow p-6" variants={containerVariants} initial="hidden" animate="visible">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Booking History</h2>
              <table className="min-w-full text-sm">
                <thead>
                  <motion.tr className="bg-gray-100" variants={itemVariants}>
                    <th className="px-4 py-2 text-left text-gray-700">ID</th>
                    <th className="px-4 py-2 text-left text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-gray-700">Issue Type</th>
                    <th className="px-4 py-2 text-left text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-gray-700">From</th>
                    <th className="px-4 py-2 text-left text-gray-700">To</th>
                  </motion.tr>
                </thead>
                <tbody>
                  {mockHistory.map(h => (
                    <motion.tr key={h.id} className="border-b last:border-b-0 hover:bg-gray-50" variants={itemVariants}>
                      <td className="px-4 py-2 text-center">{h.id}</td>
                      <td className="px-4 py-2 text-center">{h.date}</td>
                      <td className="px-4 py-2 text-center">{h.issue}</td>
                      <td className={`px-4 py-2 text-center font-semibold ${h.status === 'Completed' ? 'text-green-600' : 'text-red-500'}`}>{h.status}</td>
                      <td className="px-4 py-2 text-center">{h.from}</td>
                      <td className="px-4 py-2 text-center">{h.to}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
          {activePage === 'profile' && (
            <motion.div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto" variants={containerVariants} initial="hidden" animate="visible">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Profile</h2>
              <div className="flex flex-col items-center gap-4">
                <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-md" />
                <div className="font-bold text-lg text-gray-900">{profile.name}</div>
                <div className="text-gray-600 flex items-center gap-1"><FaPhoneAlt className="inline mr-1 text-blue-500" />{profile.phone}</div>
                <motion.button
                  className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                </motion.button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}