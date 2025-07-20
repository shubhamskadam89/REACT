import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    latitude: '',
    longitude: '',
    issueType: '',
    needAmbulance: false,
    requestedAmbulanceCount: 1,
    needPolice: false,
    requestedPoliceCount: 0,
    needFireBrigade: false,
    requestedFireTruckCount: 0,
    isForSelf: false,
    victimPhoneNumber: '',
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const body = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        requestedAmbulanceCount: Number(form.requestedAmbulanceCount),
        requestedPoliceCount: Number(form.requestedPoliceCount),
        requestedFireTruckCount: Number(form.requestedFireTruckCount),
      };
      const res = await fetch('http://localhost:8080/booking/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage('Emergency request submitted successfully!');
        setForm({
          latitude: '',
          longitude: '',
          issueType: '',
          needAmbulance: false,
          requestedAmbulanceCount: 1,
          needPolice: false,
          requestedPoliceCount: 0,
          needFireBrigade: false,
          requestedFireTruckCount: 0,
          isForSelf: false,
          victimPhoneNumber: '',
          notes: '',
        });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to submit emergency request.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
      <header className="bg-blue-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-2">24/7 Emergency Services</h1>
          <p className="text-lg">Ambulance, Police, and Fire Brigade - Always Ready to Help</p>
          <div className="flex gap-6 mt-4">
            <span className="bg-white/10 px-4 py-2 rounded-lg font-semibold">Ambulance</span>
            <span className="bg-white/10 px-4 py-2 rounded-lg font-semibold">Police</span>
            <span className="bg-white/10 px-4 py-2 rounded-lg font-semibold">Fire Brigade</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center py-10">
        <section className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Book an Emergency</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Latitude</label>
                <input name="latitude" value={form.latitude} onChange={handleChange} required type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Longitude</label>
                <input name="longitude" value={form.longitude} onChange={handleChange} required type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Issue Type / Description</label>
              <input name="issueType" value={form.issueType} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the emergency (e.g., Bus Crash at Pune)" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="needAmbulance" checked={form.needAmbulance} onChange={handleChange} /> Ambulance
              </label>
              <input name="requestedAmbulanceCount" type="number" min="0" value={form.requestedAmbulanceCount} onChange={handleChange} className="w-16 px-2 py-1 border border-gray-300 rounded" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="needPolice" checked={form.needPolice} onChange={handleChange} /> Police
              </label>
              <input name="requestedPoliceCount" type="number" min="0" value={form.requestedPoliceCount} onChange={handleChange} className="w-16 px-2 py-1 border border-gray-300 rounded" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="needFireBrigade" checked={form.needFireBrigade} onChange={handleChange} /> Fire Brigade
              </label>
              <input name="requestedFireTruckCount" type="number" min="0" value={form.requestedFireTruckCount} onChange={handleChange} className="w-16 px-2 py-1 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isForSelf" checked={form.isForSelf} onChange={handleChange} />
                Is this emergency for yourself?
              </label>
            </div>
            <div>
              <label className="block mb-1 font-medium">Victim Phone Number</label>
              <input name="victimPhoneNumber" value={form.victimPhoneNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Additional Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any extra information (e.g., people trapped inside)" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50">
              {loading ? 'Booking Emergency...' : 'Book Emergency'}
            </button>
            {message && <div className={`text-center mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
          </form>
        </section>
        
        {/* Navigation Section */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Track Emergency</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Emergency Request ID</label>
              <input 
                id="requestId" 
                type="number" 
                placeholder="Enter request ID (e.g., 1)" 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => {
                const requestId = document.getElementById('requestId').value;
                if (requestId) {
                  navigate(`/navigation/${requestId}`);
                } else {
                  alert('Please enter a request ID');
                }
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              View Navigation Map
            </button>
            <p className="text-sm text-gray-600 text-center">
              Track the route between ambulance and emergency location
            </p>
          </div>
        </section>
        
        <section className="mt-10 text-center max-w-2xl">
          <h3 className="text-xl font-semibold mb-2">Why Choose Us?</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Instant emergency booking for ambulance, police, and fire brigade</li>
            <li>24/7 availability, rapid response</li>
            <li>Track your emergency request in real-time</li>
            <li>Trusted by thousands of citizens</li>
            <li>Professional and trained responders</li>
            <li>Multi-service coordination for complex emergencies</li>
          </ul>
        </section>
      </main>
      <footer className="bg-blue-900 text-white py-4 text-center mt-auto">
        &copy; {new Date().getFullYear()} Emergency Services | All rights reserved.
      </footer>
    </div>
  );
} 