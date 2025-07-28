import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FireIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  PlusIcon,
  ArrowLeftIcon,
  TrophyIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

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
  hidden: { opacity: 0, scale: 0.98 }, // Slightly less scale for minimalism
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.01, boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.06)" }, // Even softer shadow
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function SectionHeader({ icon, title }) {
  return (
    <motion.h2
      className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="text-blue-500 text-3xl">{icon}</span> {/* Still a very subtle cool blue for icons */}
      {title}
    </motion.h2>
  );
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
  const [profileData, setProfileData] = useState({
    name: 'Firefighter Sarah Johnson',
    badge: 'F-2024-001',
    rank: 'Senior Firefighter',
    department: 'Fire Rescue Division',
    experience: '12 years',
    email: 'sarah.johnson@fire.gov',
    phone: '+1 (555) 987-6543'
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
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

  // New state for fire station and truck management
  const [fireStations, setFireStations] = useState([]);
  const [fireStationsLoading, setFireStationsLoading] = useState(false);
  const [fireStationsError, setFireStationsError] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedDriverProfile, setSelectedDriverProfile] = useState(null);
  const [selectedDriverLoading, setSelectedDriverLoading] = useState(false);
  const [selectedDriverError, setSelectedDriverError] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [selectedTruckDetails, setSelectedTruckDetails] = useState(null);
  const [selectedTruckLoading, setSelectedTruckLoading] = useState(false);
  const [selectedTruckError, setSelectedTruckError] = useState('');
  const [allTrucks, setAllTrucks] = useState([]);
  const [allTrucksLoading, setAllTrucksLoading] = useState(false);
  const [allTrucksError, setAllTrucksError] = useState('');
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedStationDetails, setSelectedStationDetails] = useState(null);
  const [selectedStationLoading, setSelectedStationLoading] = useState(false);
  const [selectedStationError, setSelectedStationError] = useState('');
  const [locationUpdateForm, setLocationUpdateForm] = useState({
    truckId: '',
    latitude: '',
    longitude: ''
  });
  const [locationUpdateLoading, setLocationUpdateLoading] = useState(false);
  const [locationUpdateMessage, setLocationUpdateMessage] = useState('');

  const [stationFormErrors, setStationFormErrors] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });
  const [locationFormErrors, setLocationFormErrors] = useState({
    truckId: '',
    latitude: '',
    longitude: ''
  });
  const [queryFormErrors, setQueryFormErrors] = useState({
    stationId: '',
    truckId: ''
  });

  const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  const lonRegex = /^-?((1?[0-7]?\d(\.\d+)?)|180(\.0+)?)$/;

  useEffect(() => {
    setStatsLoading(true);
    setStatsError('');
    fetch('http://localhost:8080/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
          throw new Error(errorData.message || 'Failed to fetch dashboard stats');
        }
        return res.json();
      })
      .then(data => setDashboardStats(data))
      .catch(err => setStatsError(err.message || 'Could not load dashboard stats.'))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'emergencies') {
      setFireBookingsLoading(true);
      setFireBookingsError('');
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setFireBookingsError('Authentication required to view emergencies.');
        setFireBookingsLoading(false);
        return;
      }
      fetch('http://localhost:8080/booking/fire', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
            throw new Error(errorData.message || 'Failed to fetch fire bookings');
          }
          return res.json();
        })
        .then(data => {
          const pendingBookings = data.filter(booking => booking.status === 'PENDING');
          const completedBookings = data.filter(booking => booking.status === 'COMPLETED');
          setFireBookings([...pendingBookings, ...completedBookings]);
        })
        .catch(err => setFireBookingsError(err.message || 'Could not load fire bookings.'))
        .finally(() => setFireBookingsLoading(false));
    }
  }, [activeTab]);

  // Fetch profile data when profile tab is active
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchFireTruckDriverProfile();
    }
  }, [activeTab]);

  const validateStationField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Station Name is required.';
        else if (value.length > 100) error = 'Station Name cannot exceed 100 characters.';
        break;
      case 'latitude':
        if (!value.toString().trim()) error = 'Latitude is required.';
        else if (!latRegex.test(value)) error = 'Invalid latitude (-90 to 90).';
        break;
      case 'longitude':
        if (!value.toString().trim()) error = 'Longitude is required.';
        else if (!lonRegex.test(value)) error = 'Invalid longitude (-180 to 180).';
        break;
      default:
        break;
    }
    setStationFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleStationChange = (e) => {
    const { name, value } = e.target;
    setStationForm((prev) => ({ ...prev, [name]: value }));
    validateStationField(name, value);
  };

  const handleStationBlur = (e) => {
    const { name, value } = e.target;
    validateStationField(name, value);
  };

  const validateAllStationFields = () => {
    let isValid = true;
    for (const key in stationForm) {
      if (!validateStationField(key, stationForm[key])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const validateLocationField = (name, value) => {
    let error = '';
    switch (name) {
      case 'truckId':
        if (!value.toString().trim()) error = 'Truck ID is required.';
        else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Truck ID must be a positive number.';
        break;
      case 'latitude':
        if (!value.toString().trim()) error = 'Latitude is required.';
        else if (!latRegex.test(value)) error = 'Invalid latitude (-90 to 90).';
        break;
      case 'longitude':
        if (!value.toString().trim()) error = 'Longitude is required.';
        else if (!lonRegex.test(value)) error = 'Invalid longitude (-180 to 180).';
        break;
      default:
        break;
    }
    setLocationFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
    validateLocationField(name, value);
  };

  const handleLocationBlur = (e) => {
    const { name, value } = e.target;
    validateLocationField(name, value);
  };

  const validateAllLocationFields = () => {
    let isValid = true;
    for (const key in locationForm) {
      if (!validateLocationField(key, locationForm[key])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const validateQueryField = (name, value) => {
    let error = '';
    switch (name) {
      case 'stationId':
        if (value.toString().trim() && (isNaN(Number(value)) || Number(value) <= 0)) error = 'Station ID must be a positive number.';
        break;
      case 'truckId':
        if (value.toString().trim() && (isNaN(Number(value)) || Number(value) <= 0)) error = 'Truck ID must be a positive number.';
        break;
      default:
        break;
    }
    setQueryFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQueryForm((prev) => ({ ...prev, [name]: value }));
    validateQueryField(name, value);
  };

  const handleQueryBlur = (e) => {
    const { name, value } = e.target;
    validateQueryField(name, value);
  };

  const stationRankings = [
    { name: 'Central Fire Station', score: 98, trucks: 8, calls: 234, responseTime: '2.8 min' },
    { name: 'North Fire Station', score: 95, trucks: 6, calls: 189, responseTime: '3.1 min' },
    { name: 'South Fire Station', score: 92, trucks: 7, calls: 201, responseTime: '3.3 min' },
    { name: 'East Fire Station', score: 89, trucks: 5, calls: 156, responseTime: '3.6 min' },
    { name: 'West Fire Station', score: 86, trucks: 6, calls: 178, responseTime: '3.9 min' },
    { name: 'Downtown Fire Station', score: 83, trucks: 10, calls: 267, responseTime: '4.2 min' }
  ];

  const handleStationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllStationFields()) {
      setMessage('Please correct the errors in the form.');
      return;
    }
    setLoading(true);

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
        setStationFormErrors({ name: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json().catch(() => ({}));
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
    if (!validateAllLocationFields()) {
      setMessage('Please correct the errors in the form.');
      return;
    }
    setLoading(true);

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
        setLocationFormErrors({ truckId: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to update fire truck location.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrucks = async () => {
    if (!queryForm.stationId.toString().trim() || !validateQueryField('stationId', queryForm.stationId)) {
      setMessage('Please enter a valid positive Station ID to get trucks.');
      return;
    }

    setMessage('');
    setLoading(true);
    setData(null);

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
        if (result.length === 0) {
          setMessage('No trucks found for this station ID.');
        } else {
          setMessage('Trucks data retrieved successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to get trucks data.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStationHistory = async () => {
    if (!queryForm.stationId.toString().trim() || !validateQueryField('stationId', queryForm.stationId)) {
      setMessage('Please enter a valid positive Station ID to get history.');
      return;
    }

    setMessage('');
    setLoading(true);
    setData(null);

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
        if (result.length === 0) {
          setMessage('No history found for this station ID.');
        } else {
          setMessage('Station history retrieved successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to get station history.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetTruckHistory = async () => {
    if (!queryForm.truckId.toString().trim() || !validateQueryField('truckId', queryForm.truckId)) {
      setMessage('Please enter a valid positive Truck ID to get history.');
      return;
    }

    setMessage('');
    setLoading(true);
    setData(null);

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
        if (result.length === 0) {
          setMessage('No history found for this truck ID.');
        } else {
          setMessage('Truck history retrieved successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to get truck history.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportTruckHistory = async () => {
    if (!reportTruckId.toString().trim()) {
      setReportError('Please enter a truck ID.');
      return;
    }
    if (isNaN(Number(reportTruckId)) || Number(reportTruckId) <= 0) {
      setReportError('Truck ID must be a positive number.');
      return;
    }

    setReportLoading(true);
    setReportError('');
    setReportTruckHistory([]);

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
        if (result.length === 0) {
          setReportError('No history found for this truck ID.');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setReportError(data.message || 'Failed to fetch truck history.');
      }
    } catch (err) {
      setReportError('Network error. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  // Function to fetch all fire stations
  const fetchAllFireStations = async () => {
    setFireStationsLoading(true);
    setFireStationsError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setFireStationsError('Authentication token not found. Please login again.');
      setFireStationsLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/fire/admin/getAll/fireStation', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setFireStations(result);
        if (result.length === 0) {
          setFireStationsError('No fire stations found.');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setFireStationsError(data.message || 'Failed to fetch fire stations.');
      }
    } catch (err) {
      setFireStationsError('Network error. Please try again.');
    } finally {
      setFireStationsLoading(false);
    }
  };

  // Function to fetch driver profile by ID
  const fetchDriverProfile = async () => {
    if (!selectedDriverId.toString().trim()) {
      alert('Please enter a driver ID.');
      return;
    }
    if (isNaN(Number(selectedDriverId)) || Number(selectedDriverId) <= 0) {
      alert('Driver ID must be a positive number.');
      return;
    }

    setSelectedDriverLoading(true);
    setSelectedDriverError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setSelectedDriverError('Authentication token not found. Please login again.');
      setSelectedDriverLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/profile/${selectedDriverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedDriverProfile(result);
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedDriverError(data.message || 'Failed to fetch driver profile.');
        setSelectedDriverProfile(null);
      }
    } catch (err) {
      setSelectedDriverError('Network error. Please try again.');
      setSelectedDriverProfile(null);
    } finally {
      setSelectedDriverLoading(false);
    }
  };

  const fetchFireTruckDriverProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/fire/truck-driver/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.name || 'Firefighter Name',
          badge: data.badgeNumber || 'N/A',
          rank: data.rank || 'N/A',
          department: data.department || 'N/A',
          experience: data.experience || 'N/A',
          email: data.email || 'N/A',
          phone: data.phone || 'N/A'
        });
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || 'Failed to fetch profile data');
        toast.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching fire truck driver profile:', error);
      setProfileError('Failed to fetch profile data');
      toast.error('Failed to fetch profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  // Function to fetch truck details by ID
  const fetchTruckDetails = async () => {
    if (!selectedTruckId.toString().trim()) {
      alert('Please enter a truck ID.');
      return;
    }
    if (isNaN(Number(selectedTruckId)) || Number(selectedTruckId) <= 0) {
      alert('Truck ID must be a positive number.');
      return;
    }

    setSelectedTruckLoading(true);
    setSelectedTruckError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setSelectedTruckError('Authentication token not found. Please login again.');
      setSelectedTruckLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/get/truck/${selectedTruckId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedTruckDetails(result);
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedTruckError(data.message || 'Failed to fetch truck details.');
        setSelectedTruckDetails(null);
      }
    } catch (err) {
      setSelectedTruckError('Network error. Please try again.');
      setSelectedTruckDetails(null);
    } finally {
      setSelectedTruckLoading(false);
    }
  };

  // Function to fetch all trucks
  const fetchAllTrucks = async () => {
    setAllTrucksLoading(true);
    setAllTrucksError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setAllTrucksError('Authentication token not found. Please login again.');
      setAllTrucksLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/fire/admin/get/all-trucks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setAllTrucks(result);
        if (result.length === 0) {
          setAllTrucksError('No trucks found.');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setAllTrucksError(data.message || 'Failed to fetch trucks.');
      }
    } catch (err) {
      setAllTrucksError('Network error. Please try again.');
    } finally {
      setAllTrucksLoading(false);
    }
  };

  // Function to fetch fire station by ID
  const fetchFireStationById = async () => {
    if (!selectedStationId.toString().trim()) {
      alert('Please enter a station ID.');
      return;
    }
    if (isNaN(Number(selectedStationId)) || Number(selectedStationId) <= 0) {
      alert('Station ID must be a positive number.');
      return;
    }

    setSelectedStationLoading(true);
    setSelectedStationError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setSelectedStationError('Authentication token not found. Please login again.');
      setSelectedStationLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/get/fire-station/${selectedStationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedStationDetails(result);
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedStationError(data.message || 'Failed to fetch fire station details.');
        setSelectedStationDetails(null);
      }
    } catch (err) {
      setSelectedStationError('Network error. Please try again.');
      setSelectedStationDetails(null);
    } finally {
      setSelectedStationLoading(false);
    }
  };

  // Function to update truck location (admin)
  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    if (!locationUpdateForm.truckId || !locationUpdateForm.latitude || !locationUpdateForm.longitude) {
      setLocationUpdateMessage('Please fill all fields.');
      return;
    }

    setLocationUpdateLoading(true);
    setLocationUpdateMessage('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setLocationUpdateMessage('Authentication token not found. Please login again.');
      setLocationUpdateLoading(false);
      return;
    }
    try {
      const requestBody = {
        ambulanceId: parseInt(locationUpdateForm.truckId),
        latitude: parseFloat(locationUpdateForm.latitude),
        longitude: parseFloat(locationUpdateForm.longitude)
      };

      const res = await fetch('http://localhost:8080/fire/admin/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        setLocationUpdateMessage('Location updated successfully!');
        setLocationUpdateForm({ truckId: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setLocationUpdateMessage(data.message || 'Failed to update location.');
      }
    } catch (err) {
      setLocationUpdateMessage('Network error. Please try again.');
    } finally {
      setLocationUpdateLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon, onClick, bgColorClass }) => (
    <motion.div
      onClick={onClick}
      className={`${bgColorClass} p-6 rounded-lg cursor-pointer flex items-center space-x-4 text-gray-800 relative overflow-hidden transition-all duration-200`} // Text will be dark
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-3xl relative z-10 text-gray-600"> {/* Icons are slightly muted */}
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <motion.div
        className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg pointer-events-none" // Hover overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.7 }}
      ></motion.div>
    </motion.div>
  );

  const StatCard = ({ title, value, subtitle, bgColorClass, icon }) => (
    <motion.div
      className={`${bgColorClass} p-6 rounded-lg shadow-md text-gray-800 relative overflow-hidden flex items-center justify-between`} // Text will be dark
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="relative z-10">
        <motion.div
          className="text-4xl text-blue-600 opacity-75" // Cool blue for icons
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 8 }} // Less dramatic rotation
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      <div className="text-right relative z-10">
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-sm opacity-90">{title}</p>
        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      </div>
      <motion.div
        className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg pointer-events-none" // Hover overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.7 }}
      ></motion.div>
    </motion.div>
  );

  const jwt = localStorage.getItem('jwt');
  const userInfo = decodeJWT(jwt);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900"> {/* Lighter base background */}
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200"> {/* White header with subtle shadow */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Fire Dashboard</h1> {/* Dark text */}
              <p className="text-gray-500">Emergency Response Management System</p> {/* Muted text */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome, {profileData.name.split(' ')[1]}</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('jwt');
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition" // Blue accent for profile icon
              >
                <UserIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: <ChartBarIcon className="h-5 w-5" /> },
              { id: 'stations', name: 'Stations', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
              { id: 'trucks', name: 'Trucks', icon: <TruckIcon className="h-5 w-5" /> },
              { id: 'management', name: 'Management', icon: <MagnifyingGlassIcon className="h-5 w-5" /> },
              { id: 'emergencies', name: 'Emergencies', icon: <FireIcon className="h-5 w-5" /> },
              { id: 'reports', name: 'Reports', icon: <DocumentTextIcon className="h-5 w-5" /> },
              { id: 'ranking', name: 'Rankings', icon: <TrophyIcon className="h-5 w-5" /> },
              { id: 'profile', name: 'Profile', icon: <UserIcon className="h-5 w-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 flex items-center space-x-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600' // Blue accent for active tab
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activeTab === 'overview' && (
          <motion.div className="space-y-8" variants={itemVariants}>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? (
                <motion.div className="col-span-4 text-center py-8 text-blue-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading statistics...</motion.div>
              ) : statsError ? (
                <motion.div className="col-span-4 text-center py-8 text-red-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{statsError}</motion.div>
              ) : dashboardStats ? (
                <>
                  <StatCard
                    title="Total Stations"
                    value={dashboardStats.total_fire_stations}
                    subtitle="Active fire stations"
                    bgColorClass="bg-white" // Minimal white card
                    icon={<BuildingOfficeIcon />}
                  />
                  <StatCard
                    title="Total Fire Trucks"
                    value={dashboardStats.total_fire_trucks}
                    subtitle="Available fire trucks"
                    bgColorClass="bg-white" // Minimal white card
                    icon={<TruckIcon />}
                  />
                  <StatCard
                    title="Fire Service Bookings"
                    value={dashboardStats.fire_service_bookings}
                    subtitle="Today's calls"
                    bgColorClass="bg-white" // Minimal white card
                    icon={<FireIcon />}
                  />
                  <StatCard
                    title="Avg Completion Time"
                    value={dashboardStats.average_completion_time_minutes + ' min'}
                    subtitle="Emergency response"
                    bgColorClass="bg-white" // Minimal white card
                    icon={<ClockIcon />}
                  />
                </>
              ) : null}
            </div>

            {/* Quick Actions */}
            <div>
              <SectionHeader icon={<ClipboardDocumentListIcon />} title="Quick Actions" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Add Station"
                  description="Create a new fire station"
                  icon={<PlusIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('add-station')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="Update Location"
                  description="Update truck locations"
                  icon={<MapPinIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('update-location')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Monitor active emergencies"
                  icon={<FireIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('emergencies')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="Generate Reports"
                  description="Create incident reports"
                  icon={<DocumentTextIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('reports')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="Station Rankings"
                  description="View performance metrics"
                  icon={<TrophyIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('ranking')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="My Profile"
                  description="Update personal information"
                  icon={<UserIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('profile')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="Emergency Contacts"
                  description="Quick contact list"
                  icon={<PhoneIcon className="h-6 w-6" />}
                  onClick={() => alert('Emergency contacts feature coming soon!')}
                  bgColorClass="bg-white"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '2 min ago', action: 'New fire emergency reported', location: 'Industrial Area' },
                  { time: '5 min ago', action: 'Fire truck dispatched', location: 'Central Station' },
                  { time: '12 min ago', action: 'Station status updated', location: 'North District' },
                  { time: '18 min ago', action: 'Emergency resolved', location: 'South Station' }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    variants={itemVariants}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.location}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Emergencies */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Emergencies</h3>
              <div className="space-y-3">
                {fireBookingsLoading ? (
                  <motion.div className="text-blue-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading fire bookings...</motion.div>
                ) : fireBookingsError ? (
                  <motion.div className="text-red-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{fireBookingsError}</motion.div>
                ) : fireBookings.length === 0 ? (
                  <motion.div className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No recent emergencies found.</motion.div>
                ) : (
                  fireBookings.slice(0, 5).map((b) => (
                    <motion.div
                      key={b.booking_id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                      variants={itemVariants}
                    >
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
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'stations' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center justify-between">
              <SectionHeader icon={<BuildingOfficeIcon />} title="Fire Stations" />
              <motion.button
                onClick={() => setActiveTab('add-station')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="h-5 w-5" /> <span>Add Station</span>
              </motion.button>
            </div>

            {/* Station List */}
            <motion.div className="bg-white rounded-lg shadow-md" variants={itemVariants}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Stations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stationRankings.map((station, index) => (
                    <motion.div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h4 className="font-semibold text-gray-900">{station.name}</h4>
                      <p className="text-sm text-gray-600">Trucks: {station.trucks}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-2">
                        <CheckCircleIcon className="h-3 w-3 inline-block mr-1" /> Active
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'add-station' && (
          <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<BuildingOfficeIcon />} title="Create Fire Station" />
                <button
                  onClick={() => setActiveTab('stations')}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" /> <span>Back to Stations</span>
                </button>
              </div>

              <form onSubmit={handleStationSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input
                    id="stationName"
                    name="name"
                    value={stationForm.name}
                    onChange={handleStationChange}
                    onBlur={handleStationBlur}
                    placeholder="Enter station name"
                    required
                    maxLength="100"
                    className={`w-full px-4 py-2 border ${stationFormErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                  />
                  {stationFormErrors.name && <p className="mt-1 text-sm text-red-600">{stationFormErrors.name}</p>}
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="stationLatitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      id="stationLatitude"
                      name="latitude"
                      value={stationForm.latitude}
                      onChange={handleStationChange}
                      onBlur={handleStationBlur}
                      placeholder="e.g., 18.5204"
                      type="number"
                      step="any"
                      required
                      min="-90"
                      max="90"
                      className={`w-full px-4 py-2 border ${stationFormErrors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                    />
                    {stationFormErrors.latitude && <p className="mt-1 text-sm text-red-600">{stationFormErrors.latitude}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="stationLongitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      id="stationLongitude"
                      name="longitude"
                      value={stationForm.longitude}
                      onChange={handleStationChange}
                      onBlur={handleStationBlur}
                      placeholder="e.g., 73.8567"
                      type="number"
                      step="any"
                      required
                      min="-180"
                      max="180"
                      className={`w-full px-4 py-2 border ${stationFormErrors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                    />
                    {stationFormErrors.longitude && <p className="mt-1 text-sm text-red-600">{stationFormErrors.longitude}</p>}
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 font-semibold transition-colors duration-200"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"> {/* Spinner */} </svg>
                      Creating Station...
                    </>
                  ) : 'Create Fire Station'}
                </motion.button>
              </form>

              {message && (
                <motion.div
                  className={`mt-6 p-4 rounded-md flex items-center space-x-2 ${
                    message.includes('success')
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                  <span>{message}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'trucks' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center justify-between">
              <SectionHeader icon={<TruckIcon />} title="Fire Trucks" />
              <motion.button
                onClick={() => setActiveTab('update-location')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPinIcon className="h-5 w-5" /> <span>Update Location</span>
              </motion.button>
            </div>

            {/* Truck Management */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Query Truck Data</h3>
              <div className="space-y-4 max-w-md">
                <motion.div variants={itemVariants}>
                  <label htmlFor="queryStationId" className="block text-sm font-medium text-gray-700 mb-1">Station ID</label>
                  <input
                    id="queryStationId"
                    name="stationId"
                    value={queryForm.stationId}
                    onChange={handleQueryChange}
                    onBlur={handleQueryBlur}
                    placeholder="Enter Station ID"
                    type="number"
                    min="1"
                    className={`w-full px-4 py-2 border ${queryFormErrors.stationId ? 'border-red-500' : 'border-gray-300'} rounded-md mb-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {queryFormErrors.stationId && <p className="mt-1 text-sm text-red-600">{queryFormErrors.stationId}</p>}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleGetTrucks}
                      disabled={loading}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TruckIcon className="h-5 w-5 inline-block mr-1" /> Get Trucks
                    </motion.button>
                    <motion.button
                      onClick={handleGetStationHistory}
                      disabled={loading}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ClockIcon className="h-5 w-5 inline-block mr-1" /> Get Station History
                    </motion.button>
                  </div>
                </motion.div>
                <motion.div className="pt-4 border-t border-gray-200" variants={itemVariants}>
                  <label htmlFor="queryTruckId" className="block text-sm font-medium text-gray-700 mb-1">Truck ID</label>
                  <input
                    id="queryTruckId"
                    name="truckId"
                    value={queryForm.truckId}
                    onChange={handleQueryChange}
                    onBlur={handleQueryBlur}
                    placeholder="Enter Truck ID"
                    type="number"
                    min="1"
                    className={`w-full px-4 py-2 border ${queryFormErrors.truckId ? 'border-red-500' : 'border-gray-300'} rounded-md mb-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {queryFormErrors.truckId && <p className="mt-1 text-sm text-red-600">{queryFormErrors.truckId}</p>}
                  <motion.button
                    onClick={handleGetTruckHistory}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ClockIcon className="h-5 w-5 inline-block mr-1" /> Get Truck History
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {message && <motion.div className={`mt-4 p-3 rounded-md flex items-center space-x-2 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{message.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}<span>{message}</span></motion.div>}

            {data && (
              <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Response Data</h3>
                {Array.isArray(data) && data.length > 0 ? (
                  <div className="overflow-x-auto">
                    {data[0].registrationNumber ? (
                      <motion.table className="w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden" initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.thead className="bg-gray-50" variants={itemVariants}> {/* Minimal table header */}
                          <tr>
                            <th className="px-4 py-2 border-b text-left text-gray-600">ID</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Registration</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Driver Name</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Phone</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Status</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Last Updated</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Location</th>
                          </tr>
                        </motion.thead>
                        <motion.tbody className="bg-white">
                          {data.map((truck, index) => (
                            <motion.tr key={index} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                              <td className="px-4 py-3">{truck.id}</td>
                              <td className="px-4 py-3 font-mono">{truck.registrationNumber}</td>
                              <td className="px-4 py-3">{truck.driverName}</td>
                              <td className="px-4 py-3">{truck.driverPhoneNumber}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  truck.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                    truck.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                }`}>
                                  {truck.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {new Date(truck.lastUpdated).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {truck.latitude?.toFixed(4)}, {truck.longitude?.toFixed(4)}
                              </td>
                            </motion.tr>
                          ))}
                        </motion.tbody>
                      </motion.table>
                    ) : data[0].bookingId ? (
                      <motion.table className="w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden" initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.thead className="bg-gray-50" variants={itemVariants}> {/* Minimal table header */}
                          <tr>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Booking ID</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Pickup Location</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Issue Type</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Status</th>
                            <th className="px-4 py-2 border-b text-left text-gray-600">Created At</th>
                          </tr>
                        </motion.thead>
                        <motion.tbody className="bg-white">
                          {data.map((booking, index) => (
                            <motion.tr key={index} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                              <td className="px-4 py-3">{booking.bookingId}</td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {booking.pickupLatitude?.toFixed(6)}, {booking.pickupLongitude?.toFixed(6)}
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                  {booking.issueType}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">{new Date(booking.createdAt).toLocaleString()}</td>
                            </motion.tr>
                          ))}
                        </motion.tbody>
                      </motion.table>
                    ) : (
                      <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-60">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <motion.p className="text-gray-600 mt-4" variants={itemVariants}>No data available for the given query. Try a different ID.</motion.p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'update-location' && (
          <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<MapPinIcon />} title="Update Fire Truck Location" />
                <button
                  onClick={() => setActiveTab('trucks')}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" /> <span>Back to Trucks</span>
                </button>
              </div>

              <form onSubmit={handleLocationSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="truckIdUpdate" className="block text-sm font-medium text-gray-700 mb-1">Truck ID</label>
                  <input
                    id="truckIdUpdate"
                    name="truckId"
                    value={locationForm.truckId}
                    onChange={handleLocationChange}
                    onBlur={handleLocationBlur}
                    placeholder="Enter truck ID"
                    type="number"
                    required
                    min="1"
                    className={`w-full px-4 py-2 border ${locationFormErrors.truckId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                  />
                  {locationFormErrors.truckId && <p className="mt-1 text-sm text-red-600">{locationFormErrors.truckId}</p>}
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="locationLatitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      id="locationLatitude"
                      name="latitude"
                      value={locationForm.latitude}
                      onChange={handleLocationChange}
                      onBlur={handleLocationBlur}
                      placeholder="e.g., 19.12345"
                      type="number"
                      step="any"
                      required
                      min="-90"
                      max="90"
                      className={`w-full px-4 py-2 border ${locationFormErrors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                    />
                    {locationFormErrors.latitude && <p className="mt-1 text-sm text-red-600">{locationFormErrors.latitude}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="locationLongitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      id="locationLongitude"
                      name="longitude"
                      value={locationForm.longitude}
                      onChange={handleLocationChange}
                      onBlur={handleLocationBlur}
                      placeholder="e.g., 72.54321"
                      type="number"
                      step="any"
                      required
                      min="-180"
                      max="180"
                      className={`w-full px-4 py-2 border ${locationFormErrors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                    />
                    {locationFormErrors.longitude && <p className="mt-1 text-sm text-red-600">{locationFormErrors.longitude}</p>}
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 font-semibold transition-colors duration-200"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"> {/* Spinner */} </svg>
                      Updating Location...
                    </>
                  ) : 'Update Location'}
                </motion.button>
              </form>

              {message && (
                <motion.div
                  className={`mt-6 p-4 rounded-md flex items-center space-x-2 ${
                    message.includes('success')
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                  <span>{message}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'management' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<MagnifyingGlassIcon />} title="Fire Station & Truck Management" />
            
            {/* All Fire Stations Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">All Fire Stations</h3>
                <motion.button
                  onClick={fetchAllFireStations}
                  disabled={fireStationsLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {fireStationsLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <BuildingOfficeIcon className="h-5 w-5" /> Fetch All Fire Stations
                    </>
                  )}
                </motion.button>
              </div>
              
              {fireStationsError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {fireStationsError}
                </motion.div>
              )}
              
              {fireStations && Array.isArray(fireStations) && fireStations.length > 0 ? (
                <motion.div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm" variants={itemVariants}>
                  <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.thead className="bg-gradient-to-r from-blue-500 to-blue-600" variants={itemVariants}>
                      <tr>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Station ID</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Station Name</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Latitude</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Longitude</th>
                      </tr>
                    </motion.thead>
                    <motion.tbody className="bg-white">
                      {fireStations.map((station, idx) => (
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200" 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-4 py-3 font-bold text-blue-600">{station.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{station.fireStationName || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-700">{station.latitude}</td>
                          <td className="px-4 py-3 text-gray-700">{station.longitude}</td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </motion.table>
                </motion.div>
              ) : (
                !fireStationsLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No fire stations data available</p>
                    <p className="text-gray-500 text-sm mt-1">Click the button above to fetch fire station information</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* All Trucks Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">All Fire Trucks</h3>
                <motion.button
                  onClick={fetchAllTrucks}
                  disabled={allTrucksLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {allTrucksLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <TruckIcon className="h-5 w-5" /> Fetch All Trucks
                    </>
                  )}
                </motion.button>
              </div>
              
              {allTrucksError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {allTrucksError}
                </motion.div>
              )}
              
              {allTrucks && Array.isArray(allTrucks) && allTrucks.length > 0 ? (
                <motion.div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm" variants={itemVariants}>
                  <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.thead className="bg-gradient-to-r from-green-500 to-green-600" variants={itemVariants}>
                      <tr>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Truck ID</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Registration</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Driver Name</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Phone Number</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Status</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Last Updated</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Location</th>
                      </tr>
                    </motion.thead>
                    <motion.tbody className="bg-white">
                      {allTrucks.map((truck, idx) => (
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200" 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-4 py-3 font-bold text-green-600">{truck.id}</td>
                          <td className="px-4 py-3 font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{truck.registrationNumber || 'N/A'}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{truck.driverName}</td>
                          <td className="px-4 py-3 text-gray-700">
                            <a href={`tel:${truck.driverPhoneNumber}`} className="hover:text-green-600 transition-colors">{truck.driverPhoneNumber}</a>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              truck.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 border border-green-200' :
                              truck.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {truck.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(truck.lastUpdated).toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{truck.latitude?.toFixed(4)}, {truck.longitude?.toFixed(4)}</td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </motion.table>
                </motion.div>
              ) : (
                !allTrucksLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No trucks data available</p>
                    <p className="text-gray-500 text-sm mt-1">Click the button above to fetch truck information</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Driver Profile Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Driver Profile</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Driver ID"
                    value={selectedDriverId}
                    onChange={e => setSelectedDriverId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchDriverProfile}
                    disabled={selectedDriverLoading}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedDriverLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-5 w-5" /> Fetch Driver Profile
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {selectedDriverError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {selectedDriverError}
                </motion.div>
              )}
              
              {selectedDriverProfile ? (
                <motion.div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-200 shadow-lg" variants={itemVariants}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <UserIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">{selectedDriverProfile.name}</h4>
                      <p className="text-purple-600 font-medium">Role: {selectedDriverProfile.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600 font-medium">Email Address</span>
                        </div>
                        <a href={`mailto:${selectedDriverProfile.email}`} className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors">
                          {selectedDriverProfile.email}
                        </a>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <PhoneIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Phone Number</span>
                        </div>
                        <a href={`tel:${selectedDriverProfile.mobile}`} className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors">
                          {selectedDriverProfile.mobile}
                        </a>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">License Number</span>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-semibold">
                          {selectedDriverProfile.licenseNumber}
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <TruckIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Vehicle Registration</span>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-semibold">
                          {selectedDriverProfile.ambulanceRegNumber}
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Government ID</span>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-semibold">
                          {selectedDriverProfile.govId}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-purple-200">
                    <div className="flex items-center justify-center gap-2 text-purple-600">
                      <ShieldCheckIcon className="h-5 w-5" />
                      <span className="font-medium">Verified Fire Driver</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                !selectedDriverLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No driver profile available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a driver ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Truck Details Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Truck Details</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Truck ID"
                    value={selectedTruckId}
                    onChange={e => setSelectedTruckId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchTruckDetails}
                    disabled={selectedTruckLoading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedTruckLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <TruckIcon className="h-5 w-5" /> Fetch Truck Details
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {selectedTruckError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {selectedTruckError}
                </motion.div>
              )}
              
              {selectedTruckDetails ? (
                <motion.div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl border border-orange-200 shadow-lg" variants={itemVariants}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <TruckIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">Truck #{selectedTruckDetails.id}</h4>
                      <p className="text-orange-600 font-medium">Registration: {selectedTruckDetails.registrationNumber || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <UserIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Driver Name</span>
                        </div>
                        <p className="text-gray-800 font-semibold">{selectedTruckDetails.driverName}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <PhoneIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Driver Phone</span>
                        </div>
                        <a href={`tel:${selectedTruckDetails.driverPhoneNumber}`} className="text-orange-600 hover:text-orange-800 font-semibold hover:underline transition-colors">
                          {selectedTruckDetails.driverPhoneNumber}
                        </a>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheckIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Status</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedTruckDetails.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 border border-green-200' :
                          selectedTruckDetails.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {selectedTruckDetails.status}
                        </span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPinIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Current Location</span>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          {selectedTruckDetails.latitude?.toFixed(4)}, {selectedTruckDetails.longitude?.toFixed(4)}
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ClockIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Last Updated</span>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          {new Date(selectedTruckDetails.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                !selectedTruckLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No truck details available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a truck ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Fire Station by ID Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Fire Station Details</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Station ID"
                    value={selectedStationId}
                    onChange={e => setSelectedStationId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchFireStationById}
                    disabled={selectedStationLoading}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedStationLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <BuildingOfficeIcon className="h-5 w-5" /> Fetch Station Details
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {selectedStationError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {selectedStationError}
                </motion.div>
              )}
              
              {selectedStationDetails ? (
                <motion.div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl border border-indigo-200 shadow-lg" variants={itemVariants}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <BuildingOfficeIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">{selectedStationDetails.fireStationName}</h4>
                      <p className="text-indigo-600 font-medium">Station ID: {selectedStationDetails.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPinIcon className="h-6 w-6 text-indigo-500" />
                        <span className="text-gray-700 font-medium text-lg">Location Coordinates</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Latitude:</span>
                          <span className="font-semibold text-gray-800">{selectedStationDetails.latitude}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Longitude:</span>
                          <span className="font-semibold text-gray-800">{selectedStationDetails.longitude}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                      <div className="flex items-center gap-3 mb-4">
                        <ShieldCheckIcon className="h-6 w-6 text-indigo-500" />
                        <span className="text-gray-700 font-medium text-lg">Station Information</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Station ID:</span>
                          <span className="font-semibold text-indigo-600">{selectedStationDetails.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                !selectedStationLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No station details available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a station ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Location Update Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Update Truck Location (Admin)</h3>
              </div>
              
              <form onSubmit={handleLocationUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Truck ID</label>
                    <input
                      type="number"
                      min="1"
                      value={locationUpdateForm.truckId}
                      onChange={e => setLocationUpdateForm(prev => ({ ...prev, truckId: e.target.value }))}
                      placeholder="Enter truck ID"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={locationUpdateForm.latitude}
                      onChange={e => setLocationUpdateForm(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="e.g., 18.5204"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={locationUpdateForm.longitude}
                      onChange={e => setLocationUpdateForm(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="e.g., 73.8567"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={locationUpdateLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 shadow-lg transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {locationUpdateLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                      Updating Location...
                    </>
                  ) : (
                    <>
                      <MapPinIcon className="h-5 w-5 inline mr-2" />
                      Update Truck Location
                    </>
                  )}
                </motion.button>
              </form>
              
              {locationUpdateMessage && (
                <motion.div
                  className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
                    locationUpdateMessage.includes('success')
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {locationUpdateMessage.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                  {locationUpdateMessage}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'emergencies' && (
          <motion.div className="bg-white rounded-lg shadow-md p-6" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<FireIcon />} title="Fire Emergency Requests" />
            {fireBookingsLoading ? (
              <motion.div className="text-blue-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading fire bookings...</motion.div>
            ) : fireBookingsError ? (
              <motion.div className="text-red-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{fireBookingsError}</motion.div>
            ) : fireBookings.length === 0 ? (
              <motion.div className="text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No fire bookings found.</motion.div>
            ) : (
              <div className="overflow-x-auto">
                <motion.table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200" initial="hidden" animate="visible" variants={containerVariants}>
                  <motion.thead className="bg-gray-50" variants={itemVariants}> {/* Minimal table header */}
                    <tr>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Booking ID</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Issue Type</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Status</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Created At</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Victim Phone</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Requested By</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">For Self</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Ambulance?</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Police?</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Fire Brigade?</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Ambulance Count</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Police Count</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Fire Truck Count</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Pickup Lat</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Pickup Lng</th>
                    </tr>
                  </motion.thead>
                  <motion.tbody className="bg-white">
                    {fireBookings.map(b => (
                      <motion.tr key={b.booking_id} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                        <td className="px-4 py-3 text-center">{b.booking_id}</td>
                        <td className="px-4 py-3 text-center">{b.issue_type}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-500">{new Date(b.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">{b.victim_phone_number}</td>
                        <td className="px-4 py-3 text-center">{b.requested_by_user_id}</td>
                        <td className="px-4 py-3 text-center">{b.is_for_self ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3 text-center">{b.needs_ambulance ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3 text-center">{b.needs_police ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3 text-center">{b.needs_fire_brigade ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3 text-center">{b.requested_ambulance_count}</td>
                        <td className="px-4 py-3 text-center">{b.requested_police_count}</td>
                        <td className="px-4 py-3 text-center">{b.requested_fire_truck_count}</td>
                        <td className="px-4 py-3 text-center text-xs text-gray-500">{b.pickup_latitude}, {b.pickup_longitude}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div className="bg-white rounded-lg shadow-md p-6" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<DocumentTextIcon />} title="Reports" />
            <motion.div className="flex items-center mb-6 space-x-3" variants={itemVariants}>
              <input
                type="number"
                min="1"
                placeholder="Enter Truck ID"
                value={reportTruckId}
                onChange={e => setReportTruckId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-60"
              />
              <motion.button
                onClick={fetchReportTruckHistory}
                disabled={reportLoading}
                className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {reportLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"> {/* Spinner */} </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    <span>Get Truck History</span>
                  </>
                )}
              </motion.button>
            </motion.div>
            {reportError && (
              <motion.div
                className="mb-4 p-4 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InformationCircleIcon className="h-5 w-5" /> <span>{reportError}</span>
              </motion.div>
            )}
            {reportTruckHistory && Array.isArray(reportTruckHistory) && reportTruckHistory.length > 0 ? (
              <motion.div className="overflow-x-auto border border-gray-200 rounded-lg" variants={itemVariants}>
                <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                  <motion.thead className="bg-gray-50" variants={itemVariants}> {/* Minimal table header */}
                    <tr>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Booking ID</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Pickup Location</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Issue Type</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Status</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Created At</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Victim Phone</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Requested By</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">For Self</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Ambulance</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Police</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Fire Brigade</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Ambulance Count</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Police Count</th>
                      <th className="px-4 py-3 border-b text-left text-gray-700">Fire Truck Count</th>
                    </tr>
                  </motion.thead>
                  <motion.tbody className="bg-white">
                    {reportTruckHistory.map((item, idx) => (
                      <motion.tr key={idx} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                        <td className="px-4 py-3">{item.booking_id}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{item.pickup_latitude?.toFixed(4)}, {item.pickup_longitude?.toFixed(4)}</td>
                        <td className="px-4 py-3">{item.issue_type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3">{item.victim_phone_number}</td>
                        <td className="px-4 py-3">{item.requested_by_user_id}</td>
                        <td className="px-4 py-3">{item.is_for_self ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{item.needs_ambulance ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{item.needs_police ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{item.needs_fire_brigade ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{item.requested_ambulance_count}</td>
                        <td className="px-4 py-3">{item.requested_police_count}</td>
                        <td className="px-4 py-3">{item.requested_fire_truck_count}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </motion.div>
            ) : (
              !reportLoading && <motion.p className="text-gray-600 mt-4" variants={itemVariants}>No truck history data available. Enter a truck ID and click the button above to fetch.</motion.p>
            )}
          </motion.div>
        )}

        {activeTab === 'ranking' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center justify-between">
              <SectionHeader icon={<TrophyIcon />} title="Station Rankings" />
              <div className="text-sm text-gray-600">Performance Metrics</div>
            </div>

            {/* Top Performers */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Performing Stations</h3>
              <div className="space-y-4">
                {stationRankings.slice(0, 3).map((station, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-gray-400' : 'bg-blue-400' // Desaturated gold, silver, bronze
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
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Detailed Rankings */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Complete Rankings</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                  <motion.thead className="bg-gray-50" variants={itemVariants}> {/* Minimal table header */}
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-700">Rank</th>
                      <th className="text-left py-3 px-4 text-gray-700">Station</th>
                      <th className="text-left py-3 px-4 text-gray-700">Score</th>
                      <th className="text-left py-3 px-4 text-gray-700">Trucks</th>
                      <th className="text-left py-3 px-4 text-gray-700">Calls</th>
                      <th className="text-left py-3 px-4 text-gray-700">Response Time</th>
                    </tr>
                  </motion.thead>
                  <motion.tbody className="bg-white">
                    {stationRankings.map((station, index) => (
                      <motion.tr key={index} className="border-b border-gray-100 hover:bg-gray-50 last:border-b-0" variants={itemVariants}>
                        <td className="py-3 px-4 font-semibold text-gray-800">{index + 1}</td>
                        <td className="py-3 px-4">{station.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full" // Use blue accent for progress bar
                                style={{ width: `${station.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700">{station.score}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{station.trucks}</td>
                        <td className="py-3 px-4">{station.calls}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{station.responseTime}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<UserIcon />} title="Firefighter Profile" />
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <PencilIcon className="h-4 w-4" /> <span>Edit Profile</span>
                </button>
              </div>

              {profileLoading && (
                <motion.div className="text-center py-8 text-blue-600 font-semibold" variants={itemVariants}>
                  Loading profile data...
                </motion.div>
              )}

              {profileError && (
                <motion.div className="text-center py-8 text-red-600 font-semibold" variants={itemVariants}>
                  {profileError}
                </motion.div>
              )}

              {!profileLoading && !profileError && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Information */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium text-gray-800">{userInfo.userId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-800">{userInfo.sub || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium text-gray-800">{userInfo.role || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-100 mt-4">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium text-gray-800">{profileData.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Badge:</span>
                      <span className="font-medium text-gray-800">{profileData.badge || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Rank:</span>
                      <span className="font-medium text-gray-800">{profileData.rank || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium text-gray-800">{profileData.department || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium text-gray-800">{profileData.experience || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-800">{profileData.phone || 'N/A'}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Performance Stats */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Statistics</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm"> {/* Light neutral background */}
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 font-medium">Emergencies Responded</span> {/* Blue text for numbers */}
                        <span className="text-2xl font-bold text-blue-700">312</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">This year</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 font-medium">Success Rate</span>
                        <span className="text-2xl font-bold text-green-700">96%</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Resolved emergencies</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-700 font-medium">Response Time</span>
                        <span className="text-2xl font-bold text-yellow-700">3.2 min</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Average</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-red-700 font-medium">Service Hours</span>
                        <span className="text-2xl font-bold text-red-700">2,156</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">This year</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              )}

              {/* Recent Achievements */}
              <motion.div className="mt-10" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center border border-gray-200" // Minimal card style
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                  >
                    <div className="text-4xl mb-3 text-blue-500">🏆</div> {/* Icon with accent color */}
                    <h4 className="font-semibold text-xl text-gray-800">Firefighter of the Year</h4>
                    <p className="text-sm text-gray-600 opacity-90">2024</p>
                  </motion.div>
                  <motion.div
                    className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center border border-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                  >
                    <div className="text-4xl mb-3 text-green-500">⭐</div>
                    <h4 className="font-semibold text-xl text-gray-800">Bravery Award</h4>
                    <p className="text-sm text-gray-600 opacity-90">Rescue Operations</p>
                  </motion.div>
                  <motion.div
                    className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center border border-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                  >
                    <div className="text-4xl mb-3 text-gray-600">🎯</div>
                    <h4 className="font-semibold text-xl text-gray-800">Perfect Attendance</h4>
                    <p className="text-sm text-gray-600 opacity-90">12 months</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}