import './App.css'
import Login from './login'
import Register from './Register'
import Landing from './Landing'
import AmbulanceDashboard from './AmbulanceDashboard'
import FireDashboard from './FireDashboard'
import PoliceDashboard from './PoliceDashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/ambulance-dashboard" element={<AmbulanceDashboard />} />
        <Route path="/fire-dashboard" element={<FireDashboard />} />
        <Route path="/police-dashboard" element={<PoliceDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
