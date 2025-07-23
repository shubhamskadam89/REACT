import { useState } from 'react';

const roles = [
  { value: 'USER', label: 'User (Requester)' },
  { value: 'AMBULANCE_DRIVER', label: 'Ambulance Driver' },
  { value: 'FIRE_DRIVER', label: 'Fire Truck Driver' },
  { value: 'POLICE_OFFICER', label: 'Police Officer' },
];

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    role: 'USER',
    licenseNumber: '',
    vehicleRegNumber: '',
    hospitalID: '',
    fireStationId: '',
    policeStationId: '',
    securityQuestion: 'PET_NAME',
    securityAnswer: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    let endpoint = 'http://localhost:8080/auth/register';
    let body = {};
    if (form.role === 'AMBULANCE_DRIVER') {
      endpoint = 'http://localhost:8080/auth/register/ambulance-driver';
      body = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        governmentId: form.governmentId,
        password: form.password,
        licenseNumber: form.licenseNumber,
        vehicleRegNumber: form.vehicleRegNumber,
        hospitalID: form.hospitalID ? Number(form.hospitalID) : undefined,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
      };
    } else if (form.role === 'FIRE_DRIVER') {
      endpoint = 'http://localhost:8080/auth/register/fire-driver';
      body = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        governmentId: form.governmentId,
        password: form.password,
        licenseNumber: form.licenseNumber,
        vehicleRegNumber: form.vehicleRegNumber,
        fireStationId: form.fireStationId ? Number(form.fireStationId) : undefined,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
      };
    } else if (form.role === 'POLICE_OFFICER') {
      endpoint = 'http://localhost:8080/auth/register/police-officer';
      body = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        governmentId: form.governmentId,
        password: form.password,
        role: 'POLICE_OFFICER',
        policeStationId: form.policeStationId ? Number(form.policeStationId) : undefined,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
      };
    } else {
      // USER
      body = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        governmentId: form.governmentId,
        password: form.password,
        role: 'USER',
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
      };
    }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage('Registration successful!');
        setForm({
          fullName: '',
          email: '',
          phoneNumber: '',
          governmentId: '',
          password: '',
          role: 'USER',
          licenseNumber: '',
          vehicleRegNumber: '',
          hospitalID: '',
          fireStationId: '',
          policeStationId: '',
          securityQuestion: 'PET_NAME',
          securityAnswer: '',
        });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    }
  };

  const securityQuestions = [
    { value: 'PET_NAME', label: "What is your pet’s name?" },
    { value: 'BIRTH_CITY', label: 'In which city were you born?' },
    { value: 'FAVORITE_TEACHER', label: 'Who was your favorite teacher?' },
    { value: 'MOTHER_MAIDEN_NAME', label: "What is your mother's maiden name?" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-2xl w-full max-w-sm border-2 border-blue-100 animate-fade-in-up">
        <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-700 animate-fade-in">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block mb-1 font-medium">Full Name<br />
              <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email<br />
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number<br />
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Government ID<br />
              <input name="governmentId" value={form.governmentId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Password<br />
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Security Question<br />
              <select name="securityQuestion" value={form.securityQuestion} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                {securityQuestions.map((q) => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Security Answer<br />
              <input name="securityAnswer" value={form.securityAnswer} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Role<br />
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </label>
          </div>
          {/* Ambulance Driver fields */}
          {form.role === 'AMBULANCE_DRIVER' && (
            <>
              <div>
                <label className="block mb-1 font-medium">License Number<br />
                  <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium">Vehicle Registration Number<br />
                  <input name="vehicleRegNumber" value={form.vehicleRegNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium">Hospital ID<br />
                  <input name="hospitalID" type="number" value={form.hospitalID} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
            </>
          )}
          {/* Fire Driver fields */}
          {form.role === 'FIRE_DRIVER' && (
            <>
              <div>
                <label className="block mb-1 font-medium">License Number<br />
                  <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium">Vehicle Registration Number<br />
                  <input name="vehicleRegNumber" value={form.vehicleRegNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium">Fire Station ID<br />
                  <input name="fireStationId" type="number" value={form.fireStationId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
            </>
          )}
          {/* Police Officer fields */}
          {form.role === 'POLICE_OFFICER' && (
            <div>
              <label className="block mb-1 font-medium">Police Station ID<br />
                <input name="policeStationId" type="number" value={form.policeStationId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
            </div>
          )}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded hover:from-blue-700 hover:to-purple-700 transition-colors shadow-md animate-fade-in-up">Register</button>
        </form>
        {message && <p className={`mt-4 text-center transition-opacity duration-300 ${message.includes('success') ? 'text-green-600' : 'text-red-500'} animate-fade-in`}>{message}</p>}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/" className="text-blue-600 hover:underline animate-pulse">Login</a>
        </div>
      </div>
    </div>
  );
} 