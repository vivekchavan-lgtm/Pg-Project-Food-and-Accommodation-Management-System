// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import UserHome from './pages/UserHome'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import Navbar from './components/Navbar'

import { useAuth } from './contexts/AuthContext'


// Protected Route (for users)

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Admin Route (only admin role)

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

// ------------------------------
// Owner Route (only owner role)
// ------------------------------
const OwnerRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'owner') return <Navigate to="/" replace />
  return children
}

// ------------------------------
// DashboardRouter
// Redirects "/" to the correct dashboard based on role
// ------------------------------
const DashboardRouter = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  if (user.role === 'owner') return <Navigate to="/owner" replace />
  return <UserHome />
}

// ------------------------------
// Main Application
// ------------------------------
export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: 18 }}>
        <Routes>

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Root: redirect to correct dashboard */}
          <Route path="/" element={<DashboardRouter />} />

          {/* Admin dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Owner dashboard */}
          <Route
            path="/owner"
            element={
              <OwnerRoute>
                <OwnerDashboard />
              </OwnerRoute>
            }
          />

          {/* Unknown path → redirect to root (DashboardRouter will redirect further) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </div>
  )
}
