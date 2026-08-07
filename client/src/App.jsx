import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import Contacts from './pages/Contacts.jsx'
import FirstAid from './pages/FirstAid.jsx'
import FirstAidDetail from './pages/FirstAidDetail.jsx'
import MapsPage from './pages/Maps.jsx'
import Admin from './pages/Admin.jsx'
import MissingPersons from './pages/MissingPersons.jsx'
import BloodDonation from './pages/BloodDonation.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trust-50 via-mist-50 to-signal-50 dark:from-mist-900 dark:via-mist-900 dark:to-mist-800">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/first-aid" element={<ProtectedRoute><FirstAid /></ProtectedRoute>} />
          <Route path="/first-aid/:slug" element={<ProtectedRoute><FirstAidDetail /></ProtectedRoute>} />
          <Route path="/maps" element={<ProtectedRoute><MapsPage /></ProtectedRoute>} />
          <Route path="/missing-persons" element={<ProtectedRoute><MissingPersons /></ProtectedRoute>} />
          <Route path="/blood-donation" element={<ProtectedRoute><BloodDonation /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
