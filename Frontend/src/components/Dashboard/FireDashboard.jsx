import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocalFireDepartment, MdEmojiEvents, MdPerson, MdAdd, MdEmergency, MdAccessTime, MdLocationOn, MdOutlineLeaderboard, MdOutlineReport, MdPhone, MdMap, MdStar, MdDirectionsCar } from 'react-icons/md';
import { FaFireExtinguisher, FaTrophy, FaUser, FaPlus, FaMapMarkerAlt, FaRegClock, FaBuilding, FaTruck, FaClipboardList } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';

function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

export default function FireDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stationForm, setStationForm] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });
  const [locationForm, setLocationForm] = useState({
    truckId: '',
    latitude: '',
    longitude: ''
  });
  const [queryForm, setQueryForm] = useState({
    stationId: '',
    truckId: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Firefighter Sarah Johnson',
    badge: 'F-2024-001',
    rank: 'Senior Firefighter',
    department: 'Fire Rescue Division',
    experience: '12 years',
    email: 'sarah.johnson@fire.gov',
    phone: '+1 (555) 987-6543'
  });
  const [reportTruckHistory, setReportTruckHistory] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportTruckId, setReportTruckId] = useState('');
  const [fireBookings, setFireBookings] = useState([]);
  const [fireBookingsLoading, setFireBookingsLoading] = useState(false);
  const [fireBookingsError, setFireBookingsError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    setStatsLoading(true);
    setStatsError('');
    fetch('http://localhost:8080/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return res.json();
      })
      .then(data => setDashboardStats(data))
      .catch(() => setStatsError('Could not load dashboard stats.'))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'emergencies') {
      setFireBookingsLoading(true);
      setFireBookingsError('');
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      fetch('http://localhost:8080/booking/fire', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch fire bookings');
          return res.json();
        })
        .then(data => setFireBookings(data))
        .catch(() => setFireBookingsError('Could not load fire bookings.'))
        .finally(() => setFireBookingsLoading(false));
    }
  }, [activeTab]);

  const handleStationChange = (e) => {
    const { name, value } = e.target;
    setStationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQueryForm((prev) => ({ ...prev, [name]: value }));
  };

  // Mock statistics data
  const stats = {
    totalStations: 18,
    activeTrucks: 42,
    emergencyCalls: 67,
    responseTime: '3.8 min'
  };

  // Mock station ranking data
  const stationRankings = [
    { name: 'Central Fire Station', score: 98, trucks: 8, calls: 234, responseTime: '2.8 min' },
    { name: 'North Fire Station', score: 95, trucks: 6, calls: 189, responseTime: '3.1 min' },
    { name: 'South Fire Station', score: 92, trucks: 7, calls: 201, responseTime: '3.3 min' },
    { name: 'East Fire Station', score: 89, trucks: 5, calls: 156, responseTime: '3.6 min' },
    { name: 'West Fire Station', score: 86, trucks: 6, calls: 178, responseTime: '3.9 min' },
    { name: 'Downtown Fire Station', score: 83, trucks: 10, calls: 267, responseTime: '4.2 min' }
  ];

  // Mock recent emergencies
  const recentEmergencies = [
    { id: 'E-2024-001', type: 'Fire Emergency', status: 'Resolved', time: '1 hour ago', location: 'Industrial Area' },
    { id: 'E-2024-002', type: 'Medical Emergency', status: 'In Progress', time: '3 hours ago', location: 'Residential Zone' },
    { id: 'E-2024-003', type: 'Vehicle Accident', status: 'Under Investigation', time: '5 hours ago', location: 'Highway 101' },
    { id: 'E-2024-004', type: 'Building Fire', status: 'Resolved', time: '7 hours ago', location: 'Commercial District' },
    { id: 'E-2024-005', type: 'Chemical Spill', status: 'In Progress', time: '9 hours ago', location: 'Industrial Park' }
  ];

  const handleStationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    // Get JWT token
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        name: stationForm.name,
        latitude: parseFloat(stationForm.latitude),
        longitude: parseFloat(stationForm.longitude)
      };

      const res = await fetch('http://localhost:8080/fire/station/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
      
      if (res.ok) {
        setMessage('Fire station created successfully!');
        setStationForm({ name: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to create fire station.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    // Get JWT token
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        truckId: parseInt(locationForm.truckId),
        latitude: parseFloat(locationForm.latitude),
        longitude: parseFloat(locationForm.longitude)
      };

      const res = await fetch('http://localhost:8080/fire/truck-driver/v1/update-location', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
      
      if (res.ok) {
        setMessage('Fire truck location updated successfully!');
        setLocationForm({ truckId: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to update fire truck location.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrucks = async () => {
    if (!queryForm.stationId) {
      setMessage('Please enter a station ID.');
      return;
    }
    
    setMessage('');
    setLoading(true);
    
    // Get JWT token
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/fire/admin/station/${queryForm.stationId}/trucks`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(result);
        setMessage('Trucks data retrieved successfully!');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to get trucks data.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStationHistory = async () => {
    if (!queryForm.stationId) {
      setMessage('Please enter a station ID.');
      return;
    }
    
    setMessage('');
    setLoading(true);
    
    // Get JWT token
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/fire/admin/station/${queryForm.stationId}/history`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(result);
        setMessage('Station history retrieved successfully!');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to get station history.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetTruckHistory = async () => {
    if (!queryForm.truckId) {
      setMessage('Please enter a truck ID.');
      return;
    }
    
    setMessage('');
    setLoading(true);
    
    // Get JWT token
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/fire/admin/truck/${queryForm.truckId}/history`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(result);
        setMessage('Truck history retrieved successfully!');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to get truck history.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportTruckHistory = async () => {
    if (!reportTruckId) {
      setReportError('Please enter a truck ID.');
      return;
    }
    setReportLoading(true);
    setReportError('');
    // Get JWT token
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setReportError('Authentication token not found. Please login again.');
      setReportLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/truck/${reportTruckId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setReportTruckHistory(result);
      } else {
        const data = await res.json();
        setReportError(data.message || 'Failed to fetch truck history.');
      }
    } catch (err) {
      setReportError('Network error. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon, onClick, gradient }) => (
    <div 
      onClick={onClick}
      className={`${gradient} p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:rotate-1 border border-white/20 backdrop-blur-sm animate-fadeInUp`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl drop-shadow-sm">{icon}</div>
        <div>
          <h3 className="font-semibold text-white drop-shadow-sm">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, subtitle, gradient }) => (
    <div className={`${gradient} p-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 backdrop-blur-sm animate-fadeInUp`}>
      <div className="text-right">
        <h3 className="text-2xl font-bold text-white drop-shadow-sm">{value}</h3>
        <p className="text-sm text-white/80">{title}</p>
        {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
      </div>
    </div>
  );

  const jwt = localStorage.getItem('jwt');
  const userInfo = decodeJWT(jwt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 shadow-lg border-b border-blue-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ReactLogo />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Fire Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Emergency Fire Services Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Emergency Fire Services</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/')} 
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('jwt');
                    navigate('/login');
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Logout
                </button>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  <FaAmbulance className="text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: <MdOutlineLeaderboard className="inline text-xl align-middle" /> },
              { id: 'stations', name: 'Stations', icon: <FaBuilding className="inline text-xl align-middle" /> },
              { id: 'trucks', name: 'Trucks', icon: <FaTruck className="inline text-xl align-middle" /> },
              { id: 'emergencies', name: 'Emergencies', icon: <MdEmergency className="inline text-xl align-middle" /> },
              { id: 'reports', name: 'Reports', icon: <FaClipboardList className="inline text-xl align-middle" /> },
              { id: 'ranking', name: 'Rankings', icon: <FaTrophy className="inline text-xl align-middle" /> },
              { id: 'profile', name: 'Profile', icon: <FaUser className="inline text-xl align-middle" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? (
                <div className="col-span-4 text-center py-8 text-orange-600 font-semibold">Loading statistics...</div>
              ) : statsError ? (
                <div className="col-span-4 text-center py-8 text-red-600 font-semibold">{statsError}</div>
              ) : dashboardStats ? (
                <>
                  <StatCard
                    title="Total Stations"
                    value={dashboardStats.total_fire_stations}
                    subtitle="Active fire stations"
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                  />
                  <StatCard
                    title="Total Fire Trucks"
                    value={dashboardStats.total_fire_trucks}
                    subtitle="Available fire trucks"
                    gradient="bg-gradient-to-br from-red-500 to-red-600"
                  />
                  <StatCard
                    title="Fire Service Bookings"
                    value={dashboardStats.fire_service_bookings}
                    subtitle="Today's calls"
                    gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
                  />
                  <StatCard
                    title="Avg Completion Time"
                    value={dashboardStats.average_completion_time_minutes + ' min'}
                    subtitle="Emergency response"
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                  />
                </>
              ) : null}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Add Station"
                  description="Create a new fire station"
                  icon={<FaBuilding />}
                  onClick={() => setActiveTab('stations')}
                  gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <QuickActionCard
                  title="Update Location"
                  description="Update truck locations"
                  icon={<FaMapMarkerAlt />}
                  onClick={() => setActiveTab('trucks')}
                  gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Monitor active emergencies"
                  icon={<MdEmergency />}
                  onClick={() => setActiveTab('emergencies')}
                  gradient="bg-gradient-to-br from-red-500 to-red-600"
                />
                <QuickActionCard
                  title="Generate Reports"
                  description="Create incident reports"
                  icon={<FaClipboardList />}
                  onClick={() => setActiveTab('reports')}
                  gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <QuickActionCard
                  title="Live Map"
                  description="View real-time locations"
                  icon={<MdMap />}
                  onClick={() => window.open('/navigation/fire_truck/1', '_blank')}
                  gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
                />
                <QuickActionCard
                  title="Station Rankings"
                  description="View performance metrics"
                  icon={<FaTrophy />}
                  onClick={() => setActiveTab('ranking')}
                  gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
                />
                <QuickActionCard
                  title="My Profile"
                  description="Update personal information"
                  icon={<FaUser />}
                  onClick={() => setActiveTab('profile')}
                  gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <QuickActionCard
                  title="Emergency Contacts"
                  description="Quick contact list"
                  icon={<MdPhone />}
                  onClick={() => alert('Emergency contacts feature coming soon!')}
                  gradient="bg-gradient-to-br from-pink-500 to-pink-600"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '2 min ago', action: 'New fire emergency reported', location: 'Industrial Area' },
                  { time: '5 min ago', action: 'Fire truck dispatched', location: 'Central Station' },
                  { time: '12 min ago', action: 'Station status updated', location: 'North District' },
                  { time: '18 min ago', action: 'Emergency resolved', location: 'South Station' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.location}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Emergencies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Emergencies</h3>
              <div className="space-y-3">
                {fireBookingsLoading ? (
                  <div className="text-blue-600">Loading fire bookings...</div>
                ) : fireBookingsError ? (
                  <div className="text-red-600">{fireBookingsError}</div>
                ) : fireBookings.length === 0 ? (
                  <div className="text-gray-500">No recent emergencies found.</div>
                ) : (
                  fireBookings.slice(0, 5).map((b) => (
                    <div key={b.booking_id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          b.status === 'COMPLETED' ? 'bg-green-500' :
                          b.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{b.issue_type}</p>
                          <p className="text-xs text-gray-500">Booking ID: {b.booking_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {b.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">{new Date(b.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stations' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Fire Stations</h2>
              <button 
                onClick={() => setActiveTab('add-station')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                + Add Station
              </button>
            </div>

            {/* Station List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Stations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Central Fire Station', trucks: 8, status: 'Active' },
                    { name: 'North Fire Station', trucks: 6, status: 'Active' },
                    { name: 'South Fire Station', trucks: 7, status: 'Active' },
                    { name: 'East Fire Station', trucks: 5, status: 'Active' },
                    { name: 'West Fire Station', trucks: 6, status: 'Active' },
                    { name: 'Downtown Fire Station', trucks: 10, status: 'Active' }
                  ].map((station, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                      <h4 className="font-semibold text-gray-900">{station.name}</h4>
                      <p className="text-sm text-gray-600">Trucks: {station.trucks}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        {station.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add-station' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Fire Station</h2>
                <button 
                  onClick={() => setActiveTab('stations')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Stations
                </button>
              </div>
              
              <form onSubmit={handleStationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input 
                    name="name" 
                    value={stationForm.name} 
                    onChange={handleStationChange} 
                    placeholder="Enter station name" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input 
                      name="latitude" 
                      value={stationForm.latitude} 
                      onChange={handleStationChange} 
                      placeholder="e.g., 18.5204" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input 
                      name="longitude" 
                      value={stationForm.longitude} 
                      onChange={handleStationChange} 
                      placeholder="e.g., 73.8567" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Creating Station...' : 'Create Fire Station'}
                </button>
              </form>
              
              {message && (
                <div className={`mt-4 p-3 rounded-md ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'trucks' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Fire Trucks</h2>
              <button 
                onClick={() => setActiveTab('update-location')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Update Location
              </button>
            </div>

            {/* Truck Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Truck Data</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <input 
                    name="stationId" 
                    value={queryForm.stationId} 
                    onChange={handleQueryChange} 
                    placeholder="Station ID" 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2" 
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleGetTrucks} 
                      disabled={loading}
                      className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      Get Trucks
                    </button>
                    <button 
                      onClick={handleGetStationHistory} 
                      disabled={loading}
                      className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      Get History
                    </button>
                  </div>
                </div>
                <div>
                  <input 
                    name="truckId" 
                    value={queryForm.truckId} 
                    onChange={handleQueryChange} 
                    placeholder="Truck ID" 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2" 
                  />
                  <button 
                    onClick={handleGetTruckHistory} 
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                  >
                    Get Truck History
                  </button>
                </div>
              </div>
            </div>

            {message && <div className={`mt-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
            
            {data && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Data</h3>
                {Array.isArray(data) && data.length > 0 && (
                  <div className="overflow-x-auto">
                    {data[0].registrationNumber ? (
                      <table className="w-full text-sm bg-white border border-gray-300">
                        <thead className="bg-orange-100">
                          <tr>
                            <th className="px-3 py-2 border-b text-left">ID</th>
                            <th className="px-3 py-2 border-b text-left">Registration</th>
                            <th className="px-3 py-2 border-b text-left">Driver Name</th>
                            <th className="px-3 py-2 border-b text-left">Phone</th>
                            <th className="px-3 py-2 border-b text-left">Status</th>
                            <th className="px-3 py-2 border-b text-left">Last Updated</th>
                            <th className="px-3 py-2 border-b text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((truck, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 border-b">{truck.id}</td>
                              <td className="px-3 py-2 border-b font-mono">{truck.registrationNumber}</td>
                              <td className="px-3 py-2 border-b">{truck.driverName}</td>
                              <td className="px-3 py-2 border-b">{truck.driverPhoneNumber}</td>
                              <td className="px-3 py-2 border-b">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  truck.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                  truck.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {truck.status}
                                </span>
                              </td>
                              <td className="px-3 py-2 border-b text-xs">
                                {new Date(truck.lastUpdated).toLocaleString()}
                              </td>
                              <td className="px-3 py-2 border-b text-xs">
                                {truck.latitude?.toFixed(4)}, {truck.longitude?.toFixed(4)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : data[0].bookingId ? (
                      <table className="w-full text-sm bg-white border border-gray-300">
                        <thead className="bg-orange-100">
                          <tr>
                            <th className="px-3 py-2 border-b text-left">Booking ID</th>
                            <th className="px-3 py-2 border-b text-left">Pickup Location</th>
                            <th className="px-3 py-2 border-b text-left">Issue Type</th>
                            <th className="px-3 py-2 border-b text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((booking, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 border-b">{booking.bookingId}</td>
                              <td className="px-3 py-2 border-b text-xs">
                                {booking.pickupLatitude?.toFixed(6)}, {booking.pickupLongitude?.toFixed(6)}
                              </td>
                              <td className="px-3 py-2 border-b">
                                <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                  {booking.issueType}
                                </span>
                              </td>
                              <td className="px-3 py-2 border-b">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded border overflow-auto max-h-40">
                        {JSON.stringify(data, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'update-location' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Update Fire Truck Location</h2>
                <button 
                  onClick={() => setActiveTab('trucks')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Trucks
                </button>
              </div>
              
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Truck ID</label>
                  <input 
                    name="truckId" 
                    value={locationForm.truckId} 
                    onChange={handleLocationChange} 
                    placeholder="Enter truck ID" 
                    type="number"
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input 
                      name="latitude" 
                      value={locationForm.latitude} 
                      onChange={handleLocationChange} 
                      placeholder="e.g., 19.12345" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input 
                      name="longitude" 
                      value={locationForm.longitude} 
                      onChange={handleLocationChange} 
                      placeholder="e.g., 72.54321" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Updating Location...' : 'Update Location'}
                </button>
              </form>
              
              {message && (
                <div className={`mt-4 p-3 rounded-md ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fire Emergency Requests</h2>
            {fireBookingsLoading ? (
              <div className="text-blue-600">Loading fire bookings...</div>
            ) : fireBookingsError ? (
              <div className="text-red-600">{fireBookingsError}</div>
            ) : fireBookings.length === 0 ? (
              <div className="text-gray-500">No fire bookings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Booking ID</th>
                      <th className="px-4 py-2 border-b">Issue Type</th>
                      <th className="px-4 py-2 border-b">Status</th>
                      <th className="px-4 py-2 border-b">Created At</th>
                      <th className="px-4 py-2 border-b">Victim Phone</th>
                      <th className="px-4 py-2 border-b">Requested By</th>
                      <th className="px-4 py-2 border-b">For Self</th>
                      <th className="px-4 py-2 border-b">Ambulance?</th>
                      <th className="px-4 py-2 border-b">Police?</th>
                      <th className="px-4 py-2 border-b">Fire Brigade?</th>
                      <th className="px-4 py-2 border-b">Ambulance Count</th>
                      <th className="px-4 py-2 border-b">Police Count</th>
                      <th className="px-4 py-2 border-b">Fire Truck Count</th>
                      <th className="px-4 py-2 border-b">Pickup Lat</th>
                      <th className="px-4 py-2 border-b">Pickup Lng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fireBookings.map(b => (
                      <tr key={b.booking_id}>
                        <td className="px-4 py-2 border-b text-center">{b.booking_id}</td>
                        <td className="px-4 py-2 border-b text-center">{b.issue_type}</td>
                        <td className="px-4 py-2 border-b text-center">{b.status}</td>
                        <td className="px-4 py-2 border-b text-center">{new Date(b.created_at).toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-center">{b.victim_phone_number}</td>
                        <td className="px-4 py-2 border-b text-center">{b.requested_by_user_id}</td>
                        <td className="px-4 py-2 border-b text-center">{b.is_for_self ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2 border-b text-center">{b.needs_ambulance ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2 border-b text-center">{b.needs_police ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2 border-b text-center">{b.needs_fire_brigade ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2 border-b text-center">{b.requested_ambulance_count}</td>
                        <td className="px-4 py-2 border-b text-center">{b.requested_police_count}</td>
                        <td className="px-4 py-2 border-b text-center">{b.requested_fire_truck_count}</td>
                        <td className="px-4 py-2 border-b text-center">{b.pickup_latitude}</td>
                        <td className="px-4 py-2 border-b text-center">{b.pickup_longitude}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>
            <div className="flex items-center mb-4 gap-2">
              <input
                type="number"
                min="1"
                placeholder="Enter Truck ID"
                value={reportTruckId}
                onChange={e => setReportTruckId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 w-48"
              />
              <button
                onClick={fetchReportTruckHistory}
                disabled={reportLoading}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {reportLoading ? 'Loading...' : 'Get Truck History by ID'}
              </button>
            </div>
            {reportError && (
              <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200">{reportError}</div>
            )}
            {reportTruckHistory && Array.isArray(reportTruckHistory) && reportTruckHistory.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm bg-white border border-gray-300">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="px-3 py-2 border-b text-left">Booking ID</th>
                      <th className="px-3 py-2 border-b text-left">Pickup Location</th>
                      <th className="px-3 py-2 border-b text-left">Issue Type</th>
                      <th className="px-3 py-2 border-b text-left">Status</th>
                      <th className="px-3 py-2 border-b text-left">Created At</th>
                      <th className="px-3 py-2 border-b text-left">Victim Phone</th>
                      <th className="px-3 py-2 border-b text-left">Requested By</th>
                      <th className="px-3 py-2 border-b text-left">For Self</th>
                      <th className="px-3 py-2 border-b text-left">Ambulance</th>
                      <th className="px-3 py-2 border-b text-left">Police</th>
                      <th className="px-3 py-2 border-b text-left">Fire Brigade</th>
                      <th className="px-3 py-2 border-b text-left">Ambulance Count</th>
                      <th className="px-3 py-2 border-b text-left">Police Count</th>
                      <th className="px-3 py-2 border-b text-left">Fire Truck Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportTruckHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border-b">{item.booking_id}</td>
                        <td className="px-3 py-2 border-b text-xs">{item.pickup_latitude?.toFixed(4)}, {item.pickup_longitude?.toFixed(4)}</td>
                        <td className="px-3 py-2 border-b">{item.issue_type}</td>
                        <td className="px-3 py-2 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 border-b text-xs">{new Date(item.created_at).toLocaleString()}</td>
                        <td className="px-3 py-2 border-b">{item.victim_phone_number}</td>
                        <td className="px-3 py-2 border-b">{item.requested_by_user_id}</td>
                        <td className="px-3 py-2 border-b">{item.is_for_self ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-2 border-b">{item.needs_ambulance ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-2 border-b">{item.needs_police ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-2 border-b">{item.needs_fire_brigade ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-2 border-b">{item.requested_ambulance_count}</td>
                        <td className="px-3 py-2 border-b">{item.requested_police_count}</td>
                        <td className="px-3 py-2 border-b">{item.requested_fire_truck_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(!reportLoading && (!reportTruckHistory || reportTruckHistory.length === 0)) && (
              <p className="text-gray-600">No truck history data available. Enter a truck ID and click the button above to fetch.</p>
            )}
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Station Rankings</h2>
              <div className="text-sm text-gray-600">Performance Metrics</div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Stations</h3>
              <div className="space-y-4">
                {stationRankings.slice(0, 3).map((station, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{station.name}</h4>
                        <p className="text-sm text-gray-600">Score: {station.score}/100</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{station.responseTime}</div>
                      <div className="text-xs text-gray-500">Response Time</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Rankings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Rankings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Station</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Trucks</th>
                      <th className="text-left py-3 px-4">Calls</th>
                      <th className="text-left py-3 px-4">Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stationRankings.map((station, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{index + 1}</td>
                        <td className="py-3 px-4">{station.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full" 
                                style={{ width: `${station.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{station.score}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{station.trucks}</td>
                        <td className="py-3 px-4">{station.calls}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{station.responseTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Firefighter Profile</h2>
                <button className="text-orange-600 hover:text-orange-700 text-sm">Edit Profile</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium">{userInfo.userId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{userInfo.sub || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium">{userInfo.role || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 font-medium">Emergencies Responded</span>
                        <span className="text-2xl font-bold text-orange-600">312</span>
                      </div>
                      <p className="text-sm text-orange-600 mt-1">This year</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-medium">Success Rate</span>
                        <span className="text-2xl font-bold text-green-600">96%</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">Resolved emergencies</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-600 font-medium">Response Time</span>
                        <span className="text-2xl font-bold text-yellow-600">3.2 min</span>
                      </div>
                      <p className="text-sm text-yellow-600 mt-1">Average</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-medium">Service Hours</span>
                        <span className="text-2xl font-bold text-red-600">2,156</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">This year</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                    <div className="text-2xl mb-2"><FaTrophy /></div>
                    <h4 className="font-semibold">Firefighter of the Year</h4>
                    <p className="text-sm opacity-90">2024</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                    <div className="text-2xl mb-2"><MdStar /></div>
                    <h4 className="font-semibold">Bravery Award</h4>
                    <p className="text-sm opacity-90">Rescue Operations</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                    <div className="text-2xl mb-2"><MdOutlineLeaderboard /></div>
                    <h4 className="font-semibold">Perfect Attendance</h4>
                    <p className="text-sm opacity-90">12 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 