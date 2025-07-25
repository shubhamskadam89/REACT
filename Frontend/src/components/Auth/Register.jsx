import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../assets/login.png'; // Assuming this path is correct

const roles = [
  { value: 'USER', label: 'User (Requester)' },
  { value: 'AMBULANCE_DRIVER', label: 'Ambulance Driver' },
  { value: 'FIRE_DRIVER', label: 'Fire Truck Driver' },
  { value: 'POLICE_OFFICER', label: 'Police Officer' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function Register() {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false); // Add loading state

  // New state for individual input errors
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    licenseNumber: '',
    vehicleRegNumber: '',
    hospitalID: '',
    fireStationId: '',
    policeStationId: '',
    securityAnswer: '',
  });

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit phone number (starts with 6-9)
  const aadharRegex = /^\d{4}\s?\d{4}\s?\d{4}$/; // Aadhar Card (12 digits, optional spaces)
  const licenseRegex = /^[A-Z]{2}[0-9]{2}\s?[0-9]{11}$/i; // Indian Driving License (e.g., KA01 20200012345)
  const vehicleRegRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i; // Indian Vehicle Registration (e.g., KA01AB1234)

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full Name is required.';
        else if (value.length > 100) error = 'Full Name cannot exceed 100 characters.';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'phoneNumber':
        if (!value.trim()) error = 'Phone Number is required.';
        else if (!phoneRegex.test(value)) error = 'Must be a 10-digit Indian number (starts with 6-9).';
        break;
      case 'governmentId':
        if (!value.trim()) error = 'Government ID is required.';
        else if (!aadharRegex.test(value)) error = 'Enter 12-digit Aadhar (e.g., 1234 5678 9012).';
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required.';
        else if (value.length < 6) error = 'Password must be at least 6 characters long.';
        break;
      case 'licenseNumber':
        if (form.role === 'AMBULANCE_DRIVER' || form.role === 'FIRE_DRIVER') {
          if (!value.trim()) error = 'License Number is required.';
          else if (!licenseRegex.test(value)) error = 'Enter valid Indian License (e.g., KA01 20200012345).';
        }
        break;
      case 'vehicleRegNumber':
        if (form.role === 'AMBULANCE_DRIVER' || form.role === 'FIRE_DRIVER') {
          if (!value.trim()) error = 'Vehicle Registration is required.';
          else if (!vehicleRegRegex.test(value)) error = 'Enter valid Indian Reg (e.g., KA01AB1234).';
        }
        break;
      case 'hospitalID':
        if (form.role === 'AMBULANCE_DRIVER') {
          if (!value.toString().trim()) error = 'Hospital ID is required.';
          else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Hospital ID must be a positive number.';
        }
        break;
      case 'fireStationId':
        if (form.role === 'FIRE_DRIVER') {
          if (!value.toString().trim()) error = 'Fire Station ID is required.';
          else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Fire Station ID must be a positive number.';
        }
        break;
      case 'policeStationId':
        if (form.role === 'POLICE_OFFICER') {
          if (!value.toString().trim()) error = 'Police Station ID is required.';
          else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Police Station ID must be a positive number.';
        }
        break;
      case 'securityAnswer':
        if (!value.trim()) error = 'Security Answer is required.';
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateAllFields = () => {
    let isValid = true;
    const fieldsToValidate = ['fullName', 'email', 'phoneNumber', 'governmentId', 'password', 'securityAnswer'];

    // Add role-specific fields
    if (form.role === 'AMBULANCE_DRIVER') {
      fieldsToValidate.push('licenseNumber', 'vehicleRegNumber', 'hospitalID');
    } else if (form.role === 'FIRE_DRIVER') {
      fieldsToValidate.push('licenseNumber', 'vehicleRegNumber', 'fireStationId');
    } else if (form.role === 'POLICE_OFFICER') {
      fieldsToValidate.push('policeStationId');
    }

    for (const fieldName of fieldsToValidate) {
      // Ensure specific ID fields are not empty if role applies
      if ((fieldName === 'hospitalID' || fieldName === 'fireStationId' || fieldName === 'policeStationId') && !form[fieldName]) {
        setFormErrors(prev => ({ ...prev, [fieldName]: `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required.` }));
        isValid = false;
        continue;
      }
      // Ensure license/vehicle fields are not empty if role applies
      if ((fieldName === 'licenseNumber' || fieldName === 'vehicleRegNumber') && (form.role === 'AMBULANCE_DRIVER' || form.role === 'FIRE_DRIVER') && !form[fieldName]) {
          setFormErrors(prev => ({ ...prev, [fieldName]: `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required.` }));
          isValid = false;
          continue;
      }

      if (!validateField(fieldName, form[fieldName])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllFields()) {
      setMessage('Please correct the errors in the form.');
      return;
    }
    setLoading(true);

    let endpoint = 'http://localhost:8080/auth/register';
    let body = {};

    switch (form.role) {
      case 'AMBULANCE_DRIVER':
        endpoint = 'http://localhost:8080/auth/register/ambulance-driver';
        body = { ...form, hospitalID: Number(form.hospitalID) };
        break;
      case 'FIRE_DRIVER':
        endpoint = 'http://localhost:8080/auth/register/fire-driver';
        body = { ...form, fireStationId: Number(form.fireStationId) };
        break;
      case 'POLICE_OFFICER':
        endpoint = 'http://localhost:8080/auth/register/police-officer';
        body = { ...form, policeStationId: Number(form.policeStationId) };
        break;
      case 'ADMIN':
        endpoint = 'http://localhost:8080/auth/register/admin';
        body = { ...form }; // Admins typically don't have station IDs or licenses
        break;
      default: // USER
        body = { ...form };
        break;
    }

    // Clean up unnecessary fields based on role before sending
    const cleanedBody = { ...body };
    if (form.role !== 'AMBULANCE_DRIVER') { delete cleanedBody.licenseNumber; delete cleanedBody.vehicleRegNumber; delete cleanedBody.hospitalID; }
    if (form.role !== 'FIRE_DRIVER') { delete cleanedBody.licenseNumber; delete cleanedBody.vehicleRegNumber; delete cleanedBody.fireStationId; }
    if (form.role !== 'POLICE_OFFICER') { delete cleanedBody.policeStationId; }
    if (form.role === 'USER' || form.role === 'ADMIN') { delete cleanedBody.licenseNumber; delete cleanedBody.vehicleRegNumber; delete cleanedBody.hospitalID; delete cleanedBody.fireStationId; delete cleanedBody.policeStationId; }


    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedBody),
      });

      if (res.ok) {
        setMessage('Registration successful!');
        setForm({
          fullName: '', email: '', phoneNumber: '', governmentId: '', password: '',
          role: 'USER', licenseNumber: '', vehicleRegNumber: '', hospitalID: '',
          fireStationId: '', policeStationId: '', securityQuestion: 'PET_NAME', securityAnswer: '',
        });
        setFormErrors({}); // Clear all errors on success
        // Auto-navigate only for Admin, others will login manually
        if (form.role === 'ADMIN') {
          setTimeout(() => navigate('/admin-dashboard'), 1500); // Small delay for message to show
        } else {
            setTimeout(() => navigate('/'), 1500); // Redirect to login for other roles
        }
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const securityQuestions = [
    { value: 'PET_NAME', label: "What is your pet’s name?" },
    { value: 'BIRTH_CITY', label: 'In which city were you born?' },
    { value: 'FAVORITE_TEACHER', label: 'Who was your favorite teacher?' },
    { value: 'MOTHER_MAIDEN_NAME', label: "What is your mother's maiden name?" },
  ];

  const inputClass = (name) => `w-full px-4 py-2 border ${formErrors[name] ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-900">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Left Image (hidden on small screens) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gray-100 p-8 w-1/2"> {/* Minimalist gray background */}
          <img src={LoginImage} alt="Register Visual" className="w-64 h-64 object-contain rounded-xl shadow-md" />
        </div>
        {/* Right Form */}
        <div className="flex-1 flex flex-col justify-center p-8">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm border border-gray-200 mx-auto"> {/* Minimalist white card */}
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2> {/* Darker text */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Full Name<br />
                  <input name="fullName" value={form.fullName} onChange={handleChange} onBlur={handleBlur} required maxLength="100" className={inputClass('fullName')} />
                  {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Email<br />
                  <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required className={inputClass('email')} />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Phone Number<br />
                  <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('phoneNumber')} />
                  {formErrors.phoneNumber && <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>}
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Government ID (Aadhar)<br />
                  <input name="governmentId" value={form.governmentId} onChange={handleChange} onBlur={handleBlur} required maxLength="14" className={inputClass('governmentId')} />
                  {formErrors.governmentId && <p className="mt-1 text-sm text-red-600">{formErrors.governmentId}</p>}
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Password<br />
                  <input name="password" type="password" value={form.password} onChange={handleChange} onBlur={handleBlur} required minLength="6" className={inputClass('password')} />
                  {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Security Question<br />
                  <select name="securityQuestion" value={form.securityQuestion} onChange={handleChange} onBlur={handleBlur} required className={inputClass('securityQuestion')}>
                    {securityQuestions.map((q) => (
                      <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Security Answer<br />
                  <input name="securityAnswer" value={form.securityAnswer} onChange={handleChange} onBlur={handleBlur} required className={inputClass('securityAnswer')} />
                  {formErrors.securityAnswer && <p className="mt-1 text-sm text-red-600">{formErrors.securityAnswer}</p>}
                </label>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Register as:<br />
                  <select name="role" value={form.role} onChange={handleChange} className={inputClass('role')}>
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
                    <label className="block mb-1 font-medium text-gray-700">License Number<br />
                      <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="17" className={inputClass('licenseNumber')} />
                      {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>}
                    </label>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Vehicle Registration Number<br />
                      <input name="vehicleRegNumber" value={form.vehicleRegNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('vehicleRegNumber')} />
                      {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-600">{formErrors.vehicleRegNumber}</p>}
                    </label>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Hospital ID<br />
                      <input name="hospitalID" type="number" value={form.hospitalID} onChange={handleChange} onBlur={handleBlur} required min="1" className={inputClass('hospitalID')} />
                      {formErrors.hospitalID && <p className="mt-1 text-sm text-red-600">{formErrors.hospitalID}</p>}
                    </label>
                  </div>
                </>
              )}
              {/* Fire Driver fields */}
              {form.role === 'FIRE_DRIVER' && (
                <>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">License Number<br />
                      <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="17" className={inputClass('licenseNumber')} />
                      {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>}
                    </label>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Vehicle Registration Number<br />
                      <input name="vehicleRegNumber" value={form.vehicleRegNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('vehicleRegNumber')} />
                      {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-600">{formErrors.vehicleRegNumber}</p>}
                    </label>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Fire Station ID<br />
                      <input name="fireStationId" type="number" value={form.fireStationId} onChange={handleChange} onBlur={handleBlur} required min="1" className={inputClass('fireStationId')} />
                      {formErrors.fireStationId && <p className="mt-1 text-sm text-red-600">{formErrors.fireStationId}</p>}
                    </label>
                  </div>
                </>
              )}
              {/* Police Officer fields */}
              {form.role === 'POLICE_OFFICER' && (
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Police Station ID<br />
                    <input name="policeStationId" type="number" value={form.policeStationId} onChange={handleChange} onBlur={handleBlur} required min="1" className={inputClass('policeStationId')} />
                    {formErrors.policeStationId && <p className="mt-1 text-sm text-red-600">{formErrors.policeStationId}</p>}
                  </label>
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors shadow-md">
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            {message && <p className={`mt-4 text-center text-sm transition-opacity duration-300 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
            <div className="mt-4 text-center">
              <span className="text-gray-600">Already have an account? </span>
              <a href="/" className="text-blue-600 hover:underline">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}