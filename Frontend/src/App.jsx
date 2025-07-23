import './styles/App.css'
import { 
  Login, 
  Register, 
  AmbulanceDashboard, 
  FireDashboard, 
  PoliceDashboard, 
  UserDashboard, 
  NavigationMap,
  ForgotPassword
} from './components'
import { Landing } from './pages'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          
          {/* Auth routes - redirect if already authenticated */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes - require authentication and specific roles */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute requiredRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/ambulance-dashboard" element={
            <ProtectedRoute requiredRole="AMBULANCE_DRIVER">
              <AmbulanceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/fire-dashboard" element={
            <ProtectedRoute requiredRole="FIRE_DRIVER">
              <FireDashboard />
            </ProtectedRoute>
          } />
          <Route path="/police-dashboard" element={
            <ProtectedRoute requiredRole="POLICE_OFFICER">
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          
          {/* Navigation routes - require authentication */}
          <Route path="/navigation/:requestId" element={
            <ProtectedRoute>
              <NavigationMap />
            </ProtectedRoute>
          } />
          <Route path="/navigation/:vehicleType/:requestId" element={
            <ProtectedRoute>
              <NavigationMap />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
