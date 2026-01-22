// src/components/Navbar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationsBell from './NotificationsBell'

export default function Navbar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <nav className="navbar">
      <div className="inner container">
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <Link to="/" className="brand">FoodAccom</Link>
          {user?.role === 'owner' && <Link to="/owner" className="nav-links">Owner</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="nav-links">Admin</Link>}
        </div>

        <div>
          {user ? (
            <div className="user-info" style={{display:'flex', alignItems:'center', gap:12}}>
              <NotificationsBell />
              <span className="small">{user.username} ({user.role})</span>
              <button onClick={handleLogout} className="btn-link">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="nav-links">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
