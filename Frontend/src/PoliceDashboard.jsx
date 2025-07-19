import { useState } from 'react';

export default function PoliceDashboard() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    role: 'POLICE_OFFICER',
    policeStationId: '',
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
    try {
      const body = { ...form, policeStationId: Number(form.policeStationId) };
      const res = await fetch('http://localhost:8080/auth/register/police-officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage('Police officer registered successfully!');
        setForm({ fullName: '', email: '', phoneNumber: '', governmentId: '', password: '', role: 'POLICE_OFFICER', policeStationId: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-800">Police Officer Dashboard</h2>
        <p className="text-lg mb-2">Register a new police officer:</p>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required className="w-full px-3 py-2 border rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="w-full px-3 py-2 border rounded" />
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="w-full px-3 py-2 border rounded" />
          <input name="governmentId" value={form.governmentId} onChange={handleChange} placeholder="Government ID" required className="w-full px-3 py-2 border rounded" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required className="w-full px-3 py-2 border rounded" />
          <input name="role" value={form.role} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
          <input name="policeStationId" value={form.policeStationId} onChange={handleChange} placeholder="Police Station ID" type="number" required className="w-full px-3 py-2 border rounded" />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Registering...' : 'Register'}</button>
        </form>
        {message && <div className={`mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
      </div>
    </div>
  );
} 