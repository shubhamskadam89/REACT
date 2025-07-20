import './App.css'
import Login from './login'
import Register from './Register'
import Landing from './Landing'
import AmbulanceDashboard from './AmbulanceDashboard'
import FireDashboard from './FireDashboard'
import PoliceDashboard from './PoliceDashboard'
import UserDashboard from './UserDashboard'
import NavigationMap from './NavigationMap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/ambulance-dashboard" element={<AmbulanceDashboard />} />
        <Route path="/fire-dashboard" element={<FireDashboard />} />
        <Route path="/police-dashboard" element={<PoliceDashboard />} />
        <Route path="/navigation/:requestId" element={<NavigationMap />} />
        <Route path="/navigation/:vehicleType/:requestId" element={<NavigationMap />} />
      </Routes>
    </Router>
  )
}

export default App
