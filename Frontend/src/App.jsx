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
import FireTruckDriverPage from './components/Driver/FireTruckDriverPage';
import AmbulanceDriverPage from './components/Driver/AmbulanceDriverPage';
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
import { Landing } from './pages'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

function AmbulanceRoleSelect() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg border p-8 flex flex-col items-center animate-fade-in">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Select Your Role</h1>
        <div className="flex gap-8">
          <button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg text-xl"
            onClick={() => navigate('/ambulance-driver')}
          >
            🚑 Ambulance Driver
          </button>
          <button
            className="bg-blue-100 text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-200 transition-all duration-200 shadow-lg text-xl border border-blue-200"
            onClick={() => navigate('/ambulance-dashboard')}
          >
            🏥 Ambulance Admin
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}

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
          
          {/* After login, redirect to ambulance role select for ambulance users */}
          <Route path="/ambulance-role-select" element={<AmbulanceRoleSelect />} />
          
          {/* Protected routes - require authentication and specific roles */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute requiredRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
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
          {/* Driver routes - require authentication */}
          <Route path="/fire-truck-driver" element={
            <ProtectedRoute requiredRole="FIRE_DRIVER">
              <FireTruckDriverPage />
            </ProtectedRoute>
          } />
          <Route path="/ambulance-driver" element={
            <ProtectedRoute requiredRole="AMBULANCE_DRIVER">
              <AmbulanceDriverPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
