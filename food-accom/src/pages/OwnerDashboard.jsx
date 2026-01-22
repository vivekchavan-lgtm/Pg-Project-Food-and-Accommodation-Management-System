// src/pages/OwnerDashboard.jsx (defensive)
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getMenus, getRooms, getBookings,
  addMenu, updateMenu, deleteMenu,
  addRoom, updateRoom, deleteRoom, updateBooking
} from '../services/mockApi'
import { addNotification } from '../services/notifications'

export default function OwnerDashboard(){
  const { user } = useAuth()
  const ownerUsername = user?.username || '(unknown)'

  const [menus, setMenus] = useState([])
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async ()=> {
      try {
        await loadAll()
      } catch (err) {
        console.error('OwnerDashboard loadAll error', err)
        setError(err?.message || String(err))
      }
    })()
    // eslint-disable-next-line
  }, [])

  async function loadAll(){
    setLoading(true)
    try {
      const [m, r, b] = await Promise.all([
        typeof getMenus === 'function' ? getMenus() : Promise.resolve([]),
        typeof getRooms === 'function' ? getRooms() : Promise.resolve([]),
        typeof getBookings === 'function' ? getBookings() : Promise.resolve([])
      ])
      const menusArr = Array.isArray(m) ? m : []
      const roomsArr = Array.isArray(r) ? r : []
      const bookingsArr = Array.isArray(b) ? b : []
      setMenus(menusArr.filter(x=>x?.owner === ownerUsername))
      setRooms(roomsArr.filter(x=>x?.owner === ownerUsername))
      setBookings(bookingsArr.filter(x=>x?.owner === ownerUsername))
      setError(null)
    } catch (err) {
      console.error('loadAll caught', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="container" style={{paddingTop:20}}>
        <h1 className="page-title">Owner Dashboard (error)</h1>
        <div className="card">
          <div className="small" style={{color:'red'}}>{String(error)}</div>
          <div style={{marginTop:12}}>
            <button className="btn-primary" onClick={()=>{ setError(null); loadAll() }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{paddingTop:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 className="page-title">Owner Dashboard</h1>
        <div className="small">Signed in as <strong>{ownerUsername}</strong></div>
      </div>

      {loading && <div className="small">Loading...</div>}

      <section style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:12}}>
        <div className="card"><div className="small">Your Menus</div><div style={{marginTop:8,fontWeight:700,fontSize:20}}>{menus.length}</div></div>
        <div className="card"><div className="small">Your Rooms</div><div style={{marginTop:8,fontWeight:700,fontSize:20}}>{rooms.length}</div></div>
        <div className="card"><div className="small">Pending Bookings</div><div style={{marginTop:8,fontWeight:700,fontSize:20}}>{bookings.filter(b=>b?.status==='pending').length}</div></div>
      </section>

      <section style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12, marginTop:12}}>
        <div>
          <div className="card" style={{marginBottom:12}}>
            <h3 style={{marginTop:0}}>Bookings for your items</h3>
            {bookings.length===0 ? <div className="small">No bookings yet</div> : bookings.map(b=>(
              <div key={b.id} style={{padding:'8px 0',borderBottom:'1px dashed #eee',display:'flex',justifyContent:'space-between'}}>
                <div>
                  <div><strong>#{b.id}</strong> by {b.username}</div>
                  <div className="small">Menu:{b.menuId||'-'} • Room:{b.roomNumber||'-'}</div>
                  <div className="small">Status: {b.status}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <button className="btn-primary" onClick={()=>updateBooking(b.id,{status:'approved'}).then(()=>loadAll())}>Approve</button>
                  <button className="btn-link" onClick={()=>updateBooking(b.id,{status:'rejected'}).then(()=>loadAll())}>Reject</button>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{marginTop:0}}>Your Menus</h3>
            {menus.map(m=>(
              <div key={m.id} style={{padding:'8px 0',borderBottom:'1px dashed #eee', display:'flex', justifyContent:'space-between'}}>
                <div><strong>{m.name}</strong><div className="small">{m.type} • ₹{m.price}</div></div>
                <div style={{display:'flex',gap:8}}><button className="btn-link">Edit</button><button className="btn-link">Delete</button></div>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div className="card">
            <h3 style={{marginTop:0}}>Your Rooms</h3>
            {rooms.map(r=>(
              <div key={r.id} style={{padding:'8px 0',borderBottom:'1px dashed #eee', display:'flex', justifyContent:'space-between'}}>
                <div><strong>{r.number}</strong><div className="small">{r.type} • ₹{r.price} • {r.available? 'Available':'Not'}</div></div>
                <div style={{display:'flex',gap:8}}><button className="btn-link">Edit</button><button className="btn-link">Delete</button></div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  )
}
