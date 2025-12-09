import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login(){
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('user')
  const { login } = useAuth()
  const nav = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ username, role })
    if(role === 'admin') nav('/admin')
    else nav('/')
  }

  return (
    <div className="container" style={{paddingTop:24}}>
      <div className="card form">
        <h2 style={{marginBottom:12}}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label className="small">Username</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="vishwa" />

          <label className="small">Role</label>
          <select className="select" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="user">User</option>
             <option value="owner">Owner</option> 
            <option value="admin">Admin</option>
          </select>

          <button className="btn-primary" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  )
}
