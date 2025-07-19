import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const issueTypes = [
  "Medical Emergency",
  "Car Accident",
  "Fire",
  "Plane Crash",
  "Natural Disaster",
  "Assault",
  "Heart Attack",
  "Stroke",
  "Other"
];

export default function BookingForm() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    issueType: "",
    notes: "",
    needAmbulance: false,
    requestedAmbulanceCount: 1,
    needPolice: false,
    requestedPoliceCount: 1,
    needFireBrigade: false,
    requestedFireTruckCount: 1,
    isForSelf: true,
    victimPhoneNumber: "",
    address: ""
  });

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Please enter coordinates manually.");
          setLocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        [name]: checked,
        // Reset count to 1 when service is enabled
        ...(checked && name === 'needAmbulance' && { requestedAmbulanceCount: 1 }),
        ...(checked && name === 'needPolice' && { requestedPoliceCount: 1 }),
        ...(checked && name === 'needFireBrigade' && { requestedFireTruckCount: 1 })
      }));
    } else if (type === 'number') {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.issueType) {
      setError("Please select an issue type.");
      return;
    }
    
    if (!form.needAmbulance && !form.needPolice && !form.needFireBrigade) {
      setError("Please select at least one service (Ambulance, Police, or Fire Brigade).");
      return;
    }
    
    if (!form.isForSelf && !form.victimPhoneNumber) {
      setError("Please enter the victim's phone number.");
      return;
    }
    
    const latitudeNum = parseFloat(form.latitude);
    const longitudeNum = parseFloat(form.longitude);
    if (isNaN(latitudeNum) || isNaN(longitudeNum)) {
      setError("Please provide a valid location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8080/booking/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: latitudeNum,
          longitude: longitudeNum,
          issueType: form.issueType,
          notes: form.notes,
          needAmbulance: form.needAmbulance,
          requestedAmbulanceCount: form.requestedAmbulanceCount,
          needPolice: form.needPolice,
          requestedPoliceCount: form.requestedPoliceCount,
          needFireBrigade: form.needFireBrigade,
          requestedFireTruckCount: form.requestedFireTruckCount,
          isForSelf: form.isForSelf,
          victimPhoneNumber: form.victimPhoneNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Booking request failed.");
        return;
      }

      // Success - navigate to tracking page
      localStorage.setItem('lastBooking', JSON.stringify({
        userLocation: { latitude: latitudeNum, longitude: longitudeNum },
        userAddress: form.address,
        bookingResponse: data
      }));
      alert("Emergency request submitted successfully! Help is on the way.");
      navigate("/tracking");
      
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-white font-cantata max-w-md mx-auto lg:max-w-lg xl:max-w-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-cantata max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
      {/* Header */}
      <div className="w-full h-[56px] bg-red-600 flex items-center justify-between px-4">
        <div className="text-white text-xl font-normal">Emergency Request</div>
        <button
          onClick={handleLogout}
          className="text-white text-sm hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
          🚨 SOS Emergency Request
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">📍 Location</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="18.5104"
                  inputMode="decimal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="73.8467"
                  inputMode="decimal"
                />
              </div>
            </div>
            {/* Address Block */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="908, ABS Road, City"
              />
            </div>
          </div>

          {/* Emergency Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">🚨 Emergency Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Issue Type *</label>
                <select
                  name="issueType"
                  value={form.issueType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select issue type</option>
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Describe the emergency situation..."
                />
              </div>
            </div>
          </div>

          {/* Service Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">🚑 Required Services</h2>
            <div className="space-y-4">
              {/* Ambulance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="needAmbulance"
                    checked={form.needAmbulance}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <label className="font-medium">🚑 Ambulance</label>
                </div>
                {form.needAmbulance && (
                  <input
                    type="number"
                    name="requestedAmbulanceCount"
                    value={form.requestedAmbulanceCount}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-16 border rounded px-2 py-1"
                  />
                )}
              </div>

              {/* Police */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="needPolice"
                    checked={form.needPolice}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <label className="font-medium">👮 Police</label>
                </div>
                {form.needPolice && (
                  <input
                    type="number"
                    name="requestedPoliceCount"
                    value={form.requestedPoliceCount}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-16 border rounded px-2 py-1"
                  />
                )}
              </div>

              {/* Fire Brigade */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="needFireBrigade"
                    checked={form.needFireBrigade}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <label className="font-medium">🚒 Fire Brigade</label>
                </div>
                {form.needFireBrigade && (
                  <input
                    type="number"
                    name="requestedFireTruckCount"
                    value={form.requestedFireTruckCount}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-16 border rounded px-2 py-1"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Victim Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">�� Victim Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isForSelf"
                  checked={form.isForSelf}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label className="font-medium">This emergency is for myself</label>
              </div>
              
              {!form.isForSelf && (
                <div>
                  <label className="block text-sm font-medium mb-1">Victim's Phone Number *</label>
                  <input
                    type="tel"
                    name="victimPhoneNumber"
                    value={form.victimPhoneNumber}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="9876543210"
                    required={!form.isForSelf}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {loading ? "Submitting Request..." : "🚨 Submit Emergency Request"}
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate("/index")}
          className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
} 