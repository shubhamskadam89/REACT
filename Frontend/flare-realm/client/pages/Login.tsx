import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const roles = ["USER", "ADMIN"];
const userTypes = ["CITIZEN", "HOSPITAL", "AMBULANCE_DRIVER"];

export default function Login() {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    governmentId: "",
    password: "",
    role: "USER",
    userType: "CITIZEN",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && (!form.fullName || !form.email || !form.phoneNumber || !form.governmentId || !form.password)) {
      setError("Please fill all fields.");
      return;
    }
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    if (isSignup) {
      try {
        const res = await fetch("http://localhost:8080/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Registration failed.");
          return;
        }
        alert("Registration successful! Please log in.");
        localStorage.setItem('userInfo', JSON.stringify({
          fullName: form.fullName,
          governmentId: form.governmentId,
          phoneNumber: form.phoneNumber
        }));
        setIsSignup(false);
      } catch (err) {
        setError("Network error. Please try again.");
      }
    } else {
      // Real login with JWT
      try {
        const res = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Login failed.");
          return;
        }
        if (data.token) {
          alert("Login successful!");
          // Debug userType values
          console.log("userType from backend:", data.userType, "userType from form:", form.userType);
          // Store user info for profile
          localStorage.setItem('userInfo', JSON.stringify({
            fullName: data.fullName || form.fullName || "",
            governmentId: data.governmentId || form.governmentId || "",
            phoneNumber: data.phoneNumber || form.phoneNumber || ""
          }));
          // If userType is AMBULANCE_DRIVER, treat as driver (robust check)
          const userTypeValue = (data.userType || form.userType || "").trim().toUpperCase();
          if (userTypeValue === "AMBULANCE_DRIVER") {
            login(data.token, data.role || form.role, data.userType || form.userType, "/driver");
          } else {
            login(data.token, data.role || form.role, data.userType || form.userType);
          }
        } else {
          setError("No token received.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Government ID</label>
                <input
                  type="text"
                  name="governmentId"
                  value={form.governmentId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  autoComplete="off"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User Type</label>
            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {userTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsSignup((v) => !v)}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
} 