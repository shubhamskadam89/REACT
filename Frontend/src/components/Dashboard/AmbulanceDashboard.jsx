import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Add a simple JWT decode function (if jwt-decode is not available)
function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

function SectionHeader({ icon, title }) {
  return (
    <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
      <span className="text-3xl">{icon}</span>
      {title}
    </h2>
  );
}

// Add a React logo SVG as a component
const ReactLogo = () => (
  <svg width="36" height="36" viewBox="0 0 841.9 595.3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="420.9" cy="296.5" r="45.7" fill="#61DAFB"/>
      <g stroke="#61DAFB" strokeWidth="30" fill="none">
        <ellipse rx="218.7" ry="545.9" transform="rotate(60 420.9 296.5)"/>
        <ellipse rx="218.7" ry="545.9" transform="rotate(120 420.9 296.5)"/>
        <ellipse rx="218.7" ry="545.9" transform="rotate(180 420.9 296.5)"/>
      </g>
    </g>
  </svg>
);

export default function AmbulanceDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    licenseNumber: '',
    vehicleRegNumber: '',
    hospitalID: '',
  });
  const [locationForm, setLocationForm] = useState({
    ambulanceId: '',
    latitude: '',
    longitude: '',
    status: 'AVAILABLE'
  });
  const [queryForm, setQueryForm] = useState({
    queryType: 'all',
    dateRange: 'today'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchedLocation, setFetchedLocation] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalAmbulances, setHospitalAmbulances] = useState([]);
  const [hospitalFetchError, setHospitalFetchError] = useState('');
  const [hospitalFetchLoading, setHospitalFetchLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('');
  const [historySortDesc, setHistorySortDesc] = useState(true);
  const [completeLoadingId, setCompleteLoadingId] = useState(null);
  const [completeMessage, setCompleteMessage] = useState('');
  const [allDrivers, setAllDrivers] = useState([]);
  const [allDriversLoading, setAllDriversLoading] = useState(false);
  const [allDriversError, setAllDriversError] = useState('');
  const [ambulances, setAmbulances] = useState([]);
  const [ambulancesLoading, setAmbulancesLoading] = useState(false);
  const [ambulancesError, setAmbulancesError] = useState('');
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [emergenciesLoading, setEmergenciesLoading] = useState(false);
  const [emergenciesError, setEmergenciesError] = useState('');
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

  // Fetch ambulance data from API when drivers or rankings tab is active
  useEffect(() => {
    if (activeTab === 'drivers' || activeTab === 'rankings') {
      setAmbulancesLoading(true);
      setAmbulancesError('');
      const jwt = localStorage.getItem('jwt');
      fetch('http://localhost:8080/ambulance/all', {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch ambulances');
          return res.json();
        })
        .then((data) => {
          // Sort by lastUpdated descending for rankings
          const sorted = [...data].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
          setAmbulances(sorted);
        })
        .catch(() => {
          setAmbulancesError('Could not load ambulances.');
        })
        .finally(() => setAmbulancesLoading(false));
    }
  }, [activeTab]);

  // Fetch recent emergencies from API when overview tab is active
  useEffect(() => {
    if (activeTab === 'overview') {
      setEmergenciesLoading(true);
      setEmergenciesError('');
      const jwt = localStorage.getItem('jwt');
      fetch('http://localhost:8080/booking/ambulance', {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch emergencies');
          return res.json();
        })
        .then((data) => {
          setRecentEmergencies(data);
        })
        .catch(() => {
          setEmergenciesError('Could not load recent emergencies.');
        })
        .finally(() => setEmergenciesLoading(false));
    }
  }, [activeTab]);

  // Mock ambulance drivers
  const ambulanceDrivers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      license: 'AMB-2024-001',
      vehicle: 'AMB-001',
      status: 'Available',
      rating: 4.8,
      emergenciesHandled: 45,
      experience: '8 years'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      license: 'AMB-2024-002',
      vehicle: 'AMB-002',
      status: 'On Call',
      rating: 4.9,
      emergenciesHandled: 52,
      experience: '12 years'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      license: 'AMB-2024-003',
      vehicle: 'AMB-003',
      status: 'Available',
      rating: 4.7,
      emergenciesHandled: 38,
      experience: '6 years'
    }
  ];

  // Mock recent emergencies
  const recentEmergenciesMock = [
    {
      id: 'E-2024-001',
      type: 'Medical Emergency',
      location: 'Downtown Medical Center',
      status: 'Resolved',
      driver: 'Dr. Sarah Johnson',
      responseTime: '2.5 min',
      timestamp: '2024-01-15 14:30'
    },
    {
      id: 'E-2024-002',
      type: 'Traffic Accident',
      location: 'Highway 101',
      status: 'In Progress',
      driver: 'Dr. Michael Chen',
      responseTime: '3.1 min',
      timestamp: '2024-01-15 15:45'
    },
    {
      id: 'E-2024-003',
      type: 'Cardiac Emergency',
      location: 'City Hospital',
      status: 'Resolved',
      driver: 'Dr. Emily Rodriguez',
      responseTime: '2.8 min',
      timestamp: '2024-01-15 16:20'
    }
  ];

  // Mock ambulance rankings
  const ambulanceRankings = [
    {
      rank: 1,
      driver: 'Dr. Michael Chen',
      vehicle: 'AMB-002',
      emergenciesHandled: 52,
      avgResponseTime: '2.8 min',
      rating: 4.9,
      efficiency: '98%'
    },
    {
      rank: 2,
      driver: 'Dr. Sarah Johnson',
      vehicle: 'AMB-001',
      emergenciesHandled: 45,
      avgResponseTime: '3.1 min',
      rating: 4.8,
      efficiency: '96%'
    },
    {
      rank: 3,
      driver: 'Dr. Emily Rodriguez',
      vehicle: 'AMB-003',
      emergenciesHandled: 38,
      avgResponseTime: '3.3 min',
      rating: 4.7,
      efficiency: '94%'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQueryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const body = { ...form, hospitalID: Number(form.hospitalID) };
      const res = await fetch('http://localhost:8080/auth/register/ambulance-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage('Ambulance driver registered successfully!');
        setForm({ fullName: '', email: '', phoneNumber: '', governmentId: '', password: '', licenseNumber: '', vehicleRegNumber: '', hospitalID: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/ambulance/location-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationForm),
      });
      if (res.ok) {
        setMessage('Location updated successfully!');
        setLocationForm({ ambulanceId: '', latitude: '', longitude: '', status: 'AVAILABLE' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Location update failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ambulance location by ID
  const handleFetchLocation = async () => {
    setFetchError('');
    setFetchedLocation(null);
    setFetchLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      if (!locationForm.ambulanceId) {
        setFetchError('Please enter an ambulance ID.');
        setFetchLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:8080/ambulance/location/${locationForm.ambulanceId}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setFetchedLocation(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setFetchError(data.message || 'Failed to fetch location.');
      }
    } catch (err) {
      setFetchError('Network error.');
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch ambulances by hospital ID
  const handleFetchByHospital = async () => {
    setHospitalFetchError('');
    setHospitalAmbulances([]);
    setHospitalFetchLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      if (!hospitalId) {
        setHospitalFetchError('Please enter a hospital ID.');
        setHospitalFetchLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:8080/ambulance/by-hospital/${hospitalId}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setHospitalAmbulances(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setHospitalFetchError(data.message || 'Failed to fetch ambulances.');
      }
    } catch (err) {
      setHospitalFetchError('Network error.');
    } finally {
      setHospitalFetchLoading(false);
    }
  };

  // Fetch ambulance driver request history
  const handleFetchHistory = async () => {
    setHistoryError('');
    setHistory([]);
    setHistoryLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/ambulance-driver/v1/get-history', {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setHistoryError(data.message || 'Failed to fetch history.');
      }
    } catch (err) {
      setHistoryError('Network error.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Complete booking by updating status
  const handleCompleteBooking = async (id) => {
    setCompleteLoadingId(id);
    setCompleteMessage('');
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/ambulance-driver/v1/complete-booking', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCompleteMessage('Booking marked as completed.');
        // Optionally, refresh the history
        await handleFetchHistory();
      } else {
        const data = await res.json().catch(() => ({}));
        setCompleteMessage(data.message || 'Failed to complete booking.');
      }
    } catch (err) {
      setCompleteMessage('Network error.');
    } finally {
      setCompleteLoadingId(null);
    }
  };

  // Filtered and sorted history
  const filteredHistory = history
    .filter(item => !historyStatusFilter || item.status === historyStatusFilter)
    .sort((a, b) => historySortDesc
      ? new Date(b.requestedAt) - new Date(a.requestedAt)
      : new Date(a.requestedAt) - new Date(b.requestedAt)
    );

  // Fetch all ambulance drivers
  const handleFetchAllDrivers = async () => {
    setAllDriversError('');
    setAllDriversLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/ambulance/all', {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAllDrivers(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setAllDriversError(data.message || 'Failed to fetch drivers.');
      }
    } catch (err) {
      setAllDriversError('Network error.');
    } finally {
      setAllDriversLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon, onClick, color, gradient }) => (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl backdrop-blur-sm border border-white/20 group relative`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center space-x-4 relative z-10">
        <div className="text-4xl transition-transform duration-200 group-hover:scale-110">{icon}</div>
        <div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Ambulance Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Emergency Medical Services Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Emergency Medical Services</p>
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
                  🚑
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
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'drivers', name: 'Drivers', icon: '👨‍⚕️' },
              { id: 'vehicles', name: 'Vehicles', icon: '🚑' },
              { id: 'emergencies', name: 'Emergencies', icon: '🚨' },
              { id: 'rankings', name: 'Rankings', icon: '🏆' },
              { id: 'profile', name: 'Profile', icon: '👤' },
              { id: 'register', name: 'Register', icon: '➕' }
            ].map((tab) => {
              const handleTabClick = () => {
                console.log('Tab clicked:', tab.id);
                console.log('Current activeTab:', activeTab);
                setActiveTab(tab.id);
                console.log('Tab should be set to:', tab.id);
              };
              
              return (
                <button
                  key={tab.id}
                  onClick={handleTabClick}
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm bg-transparent ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Register Driver"
                  description="Add new ambulance driver"
                  icon="👨‍⚕️"
                  onClick={() => setActiveTab('register')}
                  gradient="from-blue-500 via-blue-600 to-blue-700"
                />
                <QuickActionCard
                  title="Update Location"
                  description="Update ambulance location"
                  icon="📍"
                  onClick={() => setActiveTab('vehicles')}
                  gradient="from-green-500 via-green-600 to-emerald-700"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Check active emergencies"
                  icon="🚨"
                  onClick={() => setActiveTab('emergencies')}
                  gradient="from-red-500 via-red-600 to-red-700"
                />
                <QuickActionCard
                  title="Driver Rankings"
                  description="View performance rankings"
                  icon="🏆"
                  onClick={() => setActiveTab('rankings')}
                  gradient="from-yellow-500 via-orange-500 to-amber-600"
                />
                <QuickActionCard
                  title="Profile Management"
                  description="Manage driver profiles"
                  icon="👤"
                  onClick={() => setActiveTab('profile')}
                  gradient="from-indigo-500 via-purple-600 to-pink-600"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? (
                <div className="col-span-4 text-center py-8 text-blue-600 font-semibold">Loading statistics...</div>
              ) : statsError ? (
                <div className="col-span-4 text-center py-8 text-red-600 font-semibold">{statsError}</div>
              ) : dashboardStats ? (
                <>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative">
                    <div className="flex items-center relative z-10">
                      <div className="text-4xl mr-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🚑</div>
                      <div>
                        <p className="text-sm text-blue-100 font-medium">Total Ambulances</p>
                        <p className="text-3xl font-bold text-white">{dashboardStats.total_ambulances}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative">
                    <div className="flex items-center relative z-10">
                      <div className="text-4xl mr-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">👨‍⚕️</div>
                      <div>
                        <p className="text-sm text-green-100 font-medium">Available Ambulances</p>
                        <p className="text-3xl font-bold text-white">{dashboardStats.available_ambulances}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative">
                    <div className="flex items-center relative z-10">
                      <div className="text-4xl mr-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🚨</div>
                      <div>
                        <p className="text-sm text-red-100 font-medium">Total Bookings</p>
                        <p className="text-3xl font-bold text-white">{dashboardStats.ambulance_bookings}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-700 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative">
                    <div className="flex items-center relative z-10">
                      <div className="text-4xl mr-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">⏱️</div>
                      <div>
                        <p className="text-sm text-purple-100 font-medium">Avg Completion Time</p>
                        <p className="text-3xl font-bold text-white">{dashboardStats.average_completion_time_minutes} min</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Recent Emergencies */}
            <div className="bg-white/90 rounded-lg shadow-emergency p-6 animate-fade-in">
              <SectionHeader icon="🚨" title="Recent Emergencies" />
              {emergenciesLoading ? (
                <div className="text-center py-8 text-blue-600 font-semibold">Loading emergencies...</div>
              ) : emergenciesError ? (
                <div className="text-center py-8 text-red-600 font-semibold">{emergenciesError}</div>
              ) : recentEmergencies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent emergencies found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Victim Phone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Lat</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Lng</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentEmergencies.map((em) => (
                        <tr key={em.booking_id}>
                          <td className="px-4 py-2 whitespace-nowrap">{em.booking_id}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.issue_type}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${em.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{em.status}</span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{new Date(em.created_at).toLocaleString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.victim_phone_number}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.pickup_latitude}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.pickup_longitude}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ambulance Drivers</h2>
            <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
              <button
                type="button"
                onClick={handleFetchAllDrivers}
                disabled={allDriversLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {allDriversLoading ? 'Fetching...' : 'Get All Drivers'}
              </button>
              {allDriversError && (
                <div className="p-2 rounded bg-red-100 text-red-700 text-sm border border-red-200">{allDriversError}</div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(allDrivers.length > 0 ? allDrivers : ambulanceDrivers).map((driver) => (
                    <tr key={driver.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{driver.driverName || driver.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.license || driver.licenseNumber || driver.regNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.vehicle || driver.vehicleRegNumber || driver.regNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${driver.status === 'Available' || driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{driver.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.driverPhone || driver.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.latitude}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.longitude}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.lastUpdated ? new Date(driver.lastUpdated).toLocaleString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Ambulance Location</h2>
              {/* Fetch Location Section */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ambulance ID</label>
                    <input
                      name="ambulanceId"
                      value={locationForm.ambulanceId}
                      onChange={handleLocationChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter ambulance ID"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    disabled={fetchLoading}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition"
                  >
                    {fetchLoading ? 'Fetching...' : 'Get Location'}
                  </button>
                </div>
                {fetchError && (
                  <div className="mt-2 p-2 rounded bg-red-100 text-red-700 text-sm border border-red-200">{fetchError}</div>
                )}
                {fetchedLocation && (
                  <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-200">
                    <div className="font-semibold mb-2">Ambulance Location Details:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div><span className="font-medium">ID:</span> {fetchedLocation.id}</div>
                      <div><span className="font-medium">Reg Number:</span> {fetchedLocation.regNumber}</div>
                      <div><span className="font-medium">Driver Name:</span> {fetchedLocation.driverName}</div>
                      <div><span className="font-medium">Driver Phone:</span> {fetchedLocation.driverPhone}</div>
                      <div><span className="font-medium">Status:</span> {fetchedLocation.status}</div>
                      <div><span className="font-medium">Latitude:</span> {fetchedLocation.latitude}</div>
                      <div><span className="font-medium">Longitude:</span> {fetchedLocation.longitude}</div>
                      <div><span className="font-medium">Last Updated:</span> {new Date(fetchedLocation.lastUpdated).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
              {/* End Fetch Location Section */}
              {/* Fetch by Hospital Section */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital ID</label>
                    <input
                      name="hospitalId"
                      value={hospitalId}
                      onChange={e => setHospitalId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter hospital ID"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchByHospital}
                    disabled={hospitalFetchLoading}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition"
                  >
                    {hospitalFetchLoading ? 'Fetching...' : 'Get Ambulances by Hospital'}
                  </button>
                </div>
                {hospitalFetchError && (
                  <div className="mt-2 p-2 rounded bg-red-100 text-red-700 text-sm border border-red-200">{hospitalFetchError}</div>
                )}
                {hospitalAmbulances.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {hospitalAmbulances.map((amb) => (
                          <tr key={amb.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{amb.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{amb.regNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{amb.driverName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{amb.driverPhone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{amb.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{amb.latitude}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{amb.longitude}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(amb.lastUpdated).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* End Fetch by Hospital Section */}
              {/* Fetch Driver Request History Section */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-2">
                  <button
                    type="button"
                    onClick={handleFetchHistory}
                    disabled={historyLoading}
                    className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
                  >
                    {historyLoading ? 'Fetching...' : 'Get Driver Request History'}
                  </button>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                      value={historyStatusFilter}
                      onChange={e => setHistoryStatusFilter(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="">All</option>
                      <option value="EN_ROUTE">En Route</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Sort:</label>
                    <button
                      type="button"
                      onClick={() => setHistorySortDesc(v => !v)}
                      className="px-2 py-1 border border-gray-300 rounded"
                    >
                      {historySortDesc ? 'Newest First' : 'Oldest First'}
                    </button>
                  </div>
                </div>
                {historyError && (
                  <div className="mt-2 p-2 rounded bg-red-100 text-red-700 text-sm border border-red-200">{historyError}</div>
                )}
                {filteredHistory.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 font-semibold text-gray-700">Total Requests: {filteredHistory.length}</div>
                    {completeMessage && (
                      <div className={`mb-2 p-2 rounded text-sm border ${completeMessage.includes('completed') ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{completeMessage}</div>
                    )}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredHistory.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.userId}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.emailOfRequester}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{new Date(item.requestedAt).toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.latitude}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.longitude}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.status}</td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               {item.status === 'EN_ROUTE' && (
                                 <button
                                   type="button"
                                   onClick={() => handleCompleteBooking(item.id)}
                                   disabled={completeLoadingId === item.id}
                                   className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                 >
                                   {completeLoadingId === item.id ? 'Completing...' : 'Complete'}
                                 </button>
                               )}
                             </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              {/* End Fetch Driver Request History Section */}
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ambulance ID</label>
                    <input
                      name="ambulanceId"
                      value={locationForm.ambulanceId}
                      onChange={handleLocationChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter ambulance ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={locationForm.status}
                      onChange={handleLocationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="ON_CALL">On Call</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      name="latitude"
                      value={locationForm.latitude}
                      onChange={handleLocationChange}
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter latitude"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      name="longitude"
                      value={locationForm.longitude}
                      onChange={handleLocationChange}
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                >
                  {loading ? 'Updating...' : 'Update Location'}
                </button>
                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('success') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Emergencies</h2>
            <div className="space-y-4">
              {recentEmergencies.map((emergency, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{emergency.issue_type}</h3>
                      <p className="text-sm text-gray-600">ID: {emergency.booking_id}</p>
                      <p className="text-sm text-gray-600">Status: {emergency.status}</p>
                      <p className="text-sm text-gray-600">Created At: {new Date(emergency.created_at).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Victim Phone: {emergency.victim_phone_number}</p>
                      <p className="text-sm text-gray-600">Pickup Lat: {emergency.pickup_latitude}</p>
                      <p className="text-sm text-gray-600">Pickup Lng: {emergency.pickup_longitude}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emergency.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {emergency.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rankings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ambulance Rankings</h2>
            {ambulancesLoading ? (
              <div className="text-center py-8 text-blue-600 font-semibold">Loading rankings...</div>
            ) : ambulancesError ? (
              <div className="text-center py-8 text-red-600 font-semibold">{ambulancesError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Reg Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Driver Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Driver Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Latitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Longitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ambulances.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">No ambulances found.</td>
                      </tr>
                    ) : ambulances.map((amb, idx) => (
                      <tr key={amb.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{amb.regNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{amb.driverName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{amb.driverPhone}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                            ${amb.status === 'AVAILABLE' ? 'bg-green-200 text-green-900 border border-green-400' : 
                              amb.status === 'ON_CALL' ? 'bg-yellow-200 text-yellow-900 border border-yellow-400' : 
                              amb.status === 'MAINTENANCE' ? 'bg-purple-200 text-purple-900 border border-purple-400' : 
                              'bg-gray-200 text-gray-900 border border-gray-400'}
                          `}>{amb.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">{Number(amb.latitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">{Number(amb.longitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">{new Date(amb.lastUpdated).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ambulance Service Profile</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Edit Profile</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Service Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        🚑
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{userInfo.role || 'N/A'}</h4>
                        <p className="text-sm text-gray-600">{userInfo.sub || 'N/A'}</p>
                      </div>
                    </div>
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
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900">Response Efficiency</h4>
                      <p className="text-sm text-blue-700">98% of emergencies responded within 5 minutes</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900">Patient Satisfaction</h4>
                      <p className="text-sm text-green-700">4.8/5 average rating from patients</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900">Safety Record</h4>
                      <p className="text-sm text-purple-700">Zero major incidents in the last 12 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Register Ambulance Driver</h2>
                <p className="text-gray-600">Add a new ambulance driver to the emergency response team</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Government ID</label>
                    <input
                      name="governmentId"
                      value={form.governmentId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter government ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      name="licenseNumber"
                      value={form.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter license number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Registration</label>
                    <input
                      name="vehicleRegNumber"
                      value={form.vehicleRegNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter vehicle registration"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital ID</label>
                    <input
                      name="hospitalID"
                      value={form.hospitalID}
                      onChange={handleChange}
                      type="number"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter hospital ID"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                >
                  {loading ? 'Registering...' : 'Register Ambulance Driver'}
                </button>

                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('success') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 