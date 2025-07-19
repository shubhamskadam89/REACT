import { useState } from 'react';

export default function FireDashboard() {
  const [activeTab, setActiveTab] = useState('station');
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

      const res = await fetch('http://localhost:8080/fire/location/update', {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-orange-700">Fire Dashboard</h2>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab('station')}
            className={`px-4 py-2 ${activeTab === 'station' ? 'bg-orange-600 text-white' : 'text-orange-600'}`}
          >
            Add Station
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`px-4 py-2 ${activeTab === 'location' ? 'bg-orange-600 text-white' : 'text-orange-600'}`}
          >
            Update Location
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`px-4 py-2 ${activeTab === 'query' ? 'bg-orange-600 text-white' : 'text-orange-600'}`}
          >
            Query Data
          </button>
        </div>

        {/* Add Station Form */}
        {activeTab === 'station' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Create Fire Station</h3>
            <form onSubmit={handleStationSubmit} className="space-y-3 text-left max-w-md mx-auto">
              <input 
                name="name" 
                value={stationForm.name} 
                onChange={handleStationChange} 
                placeholder="Station Name" 
                required 
                className="w-full px-3 py-2 border rounded" 
              />
              <input 
                name="latitude" 
                value={stationForm.latitude} 
                onChange={handleStationChange} 
                placeholder="Latitude (e.g., 18.5204)" 
                type="number" 
                step="any"
                required 
                className="w-full px-3 py-2 border rounded" 
              />
              <input 
                name="longitude" 
                value={stationForm.longitude} 
                onChange={handleStationChange} 
                placeholder="Longitude (e.g., 73.8567)" 
                type="number" 
                step="any"
                required 
                className="w-full px-3 py-2 border rounded" 
              />
              <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Station'}
              </button>
            </form>
          </div>
        )}

        {/* Update Location Form */}
        {activeTab === 'location' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Update Fire Truck Location</h3>
            <form onSubmit={handleLocationSubmit} className="space-y-3 text-left max-w-md mx-auto">
              <input 
                name="truckId" 
                value={locationForm.truckId} 
                onChange={handleLocationChange} 
                placeholder="Truck ID" 
                type="number"
                required 
                className="w-full px-3 py-2 border rounded" 
              />
              <input 
                name="latitude" 
                value={locationForm.latitude} 
                onChange={handleLocationChange} 
                placeholder="Latitude (e.g., 19.12345)" 
                type="number" 
                step="any"
                required 
                className="w-full px-3 py-2 border rounded" 
              />
              <input 
                name="longitude" 
                value={locationForm.longitude} 
                onChange={handleLocationChange} 
                placeholder="Longitude (e.g., 72.54321)" 
                type="number" 
                step="any"
                required 
                className="w-full px-3 py-2 border rounded" 
              />
              <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Location'}
              </button>
            </form>
          </div>
        )}

        {/* Query Data Section */}
        {activeTab === 'query' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Query Fire Data</h3>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <input 
                  name="stationId" 
                  value={queryForm.stationId} 
                  onChange={handleQueryChange} 
                  placeholder="Station ID" 
                  type="number"
                  className="w-full px-3 py-2 border rounded mb-2" 
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
                  className="w-full px-3 py-2 border rounded mb-2" 
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
        )}

        {message && <div className={`mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
        
        {data && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Response Data:</h3>
            {Array.isArray(data) && data.length > 0 && (
              <div className="overflow-x-auto">
                {data[0].registrationNumber ? (
                  // Trucks data format
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
                  // Truck history format
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
                  // Fallback to JSON for other data types
                  <div className="text-xs text-gray-600 font-mono bg-white p-3 rounded border overflow-auto max-h-40">
                    {JSON.stringify(data, null, 2)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 