import { useState } from 'react';

export default function PoliceDashboard() {
  const [form, setForm] = useState({
    id: '',
    stationName: '',
    latitude: '',
    longitude: '',
    availableOfficers: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    // Get JWT token
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        id: form.id ? parseInt(form.id) : undefined,
        stationName: form.stationName,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        availableOfficers: parseInt(form.availableOfficers)
      };

      const res = await fetch('http://localhost:8080/police/station/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
      
      if (res.ok) {
        setMessage('Police station created successfully!');
        setForm({ id: '', stationName: '', latitude: '', longitude: '', availableOfficers: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to create police station.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-800">Police Station Dashboard</h2>
        <p className="text-lg mb-2">Create a new police station:</p>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input 
            name="id" 
            value={form.id} 
            onChange={handleChange} 
            placeholder="Station ID (optional)" 
            type="number"
            className="w-full px-3 py-2 border rounded" 
          />
          <input 
            name="stationName" 
            value={form.stationName} 
            onChange={handleChange} 
            placeholder="Station Name" 
            required 
            className="w-full px-3 py-2 border rounded" 
          />
          <input 
            name="latitude" 
            value={form.latitude} 
            onChange={handleChange} 
            placeholder="Latitude (e.g., 10.5204)" 
            type="number" 
            step="any"
            required 
            className="w-full px-3 py-2 border rounded" 
          />
          <input 
            name="longitude" 
            value={form.longitude} 
            onChange={handleChange} 
            placeholder="Longitude (e.g., 73.8567)" 
            type="number" 
            step="any"
            required 
            className="w-full px-3 py-2 border rounded" 
          />
          <input 
            name="availableOfficers" 
            value={form.availableOfficers} 
            onChange={handleChange} 
            placeholder="Available Officers" 
            type="number" 
            min="0"
            required 
            className="w-full px-3 py-2 border rounded" 
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Police Station'}
          </button>
        </form>
        {message && <div className={`mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
      </div>
    </div>
  );
} 