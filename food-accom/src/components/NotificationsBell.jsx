// src/components/NotificationsBell.jsx
import React, { useEffect, useState, useRef } from 'react'
import { getNotifications, markRead, markAllRead } from '../services/notifications'
import { useAuth } from '../contexts/AuthContext'

export default function NotificationsBell() {
  const { user } = useAuth()
  const username = user?.username
  const role = user?.role
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const ref = useRef()

  useEffect(() => {
    load()
    
    const t = setInterval(load, 3000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, role])

  async function load() {
    const all = await getNotifications()
    // filter notifications relevant to this user
    const filtered = all.filter(n => {
      if (!n.to) return true
      if (n.to === 'all') return true
      if (n.to === username) return true
      if (n.to === role) return true
      return false
    })
    setItems(filtered)
  }

  const unreadCount = items.filter(i => i.unread).length

  // click outside to close dropdown
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  async function handleMarkRead(id) {
    await markRead(id)
    await load()
  }

  async function handleMarkAll() {
    await markAllRead(username || role)
    await load()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => { setOpen(!open); if (open) handleMarkAll() }} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
        <span style={{ fontSize: 18 }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', borderRadius: 999, padding: '2px 6px', fontSize: 11
          }}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, marginTop: 8, width: 360,
          zIndex: 2000
        }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>Notifications</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn-link" onClick={handleMarkAll}>Mark all read</button>
              </div>
            </div>

            <div style={{ maxHeight: 320, overflow: 'auto', marginTop: 8 }}>
              {items.length === 0 && <div className="small">No notifications</div>}
              {items.map(n => (
                <div key={n.id} style={{ padding: 8, borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div className="small" style={{ marginTop: 4 }}>{n.body}</div>
                    <div className="small" style={{ marginTop: 6 }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {n.unread && <button className="btn-primary" onClick={() => handleMarkRead(n.id)}>Mark</button>}
                    <div className="small">To: {n.to}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
