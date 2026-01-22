// src/pages/UserHome.jsx
import React, { useEffect, useState } from 'react'
import { getMenus, getRooms, getBookings, addBooking } from '../services/mockApi'
import { addNotification } from '../services/notifications'
import { useAuth } from '../contexts/AuthContext'

export default function UserHome(){
  const { user } = useAuth()
  const username = user?.username || ''

  const [menus, setMenus] = useState([])
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])

  // form states
  const [foodForm, setFoodForm] = useState({ menuId:'', nights:1 })
  const [roomForm, setRoomForm] = useState({ roomId:'', nights:1 })

  const [loading, setLoading] = useState(false)

  useEffect(()=> { loadAll() }, [])

  async function loadAll(){
    setLoading(true)
    try {
      const [m, r, b] = await Promise.all([getMenus(), getRooms(), getBookings()])
      setMenus(Array.isArray(m) ? m : [])
      setRooms(Array.isArray(r) ? r : [])
      // show only this user's bookings
      setBookings((Array.isArray(b) ? b : []).filter(x => x.username === username))
    } catch (err) {
      console.error('loadAll userhome error', err)
    } finally {
      setLoading(false)
    }
  }

  // FOOD booking
  async function handleFoodBooking(e){
    e.preventDefault()
    if(!foodForm.menuId) return alert('Please select a menu')
    try {
      await addBooking({
        username,
        menuId: Number(foodForm.menuId),
        nights: Number(foodForm.nights)
      })

      // 🔔 Notify admin
      await addNotification({
        to: 'admin',
        title: 'New food booking',
        body: `User ${username} requested menu ${foodForm.menuId}`,
        meta: { type: 'booking', kind: 'food' }
      })

      // 🔔 Notify the owner of the menu
      const menu = menus.find(m => String(m.id) === String(foodForm.menuId))
      if (menu?.owner) {
        await addNotification({
          to: menu.owner,
          title: 'New booking request',
          body: `User ${username} requested ${menu.name}`,
          meta: { bookingType: 'food' }
        })
      }

      setFoodForm({ menuId:'', nights:1 })
      await loadAll()
      alert('Food booking requested (pending approval)')
    } catch (err) {
      console.error('food booking error', err)
      alert('Failed to create booking')
    }
  }

  // ROOM booking
  async function handleRoomBooking(e){
    e.preventDefault()
    if(!roomForm.roomId) return alert('Please select a room')
    const room = rooms.find(r => String(r.id) === String(roomForm.roomId))
    if(!room) return alert('Selected room not found')
    if(!room.available) return alert('Selected room is not available')

    try {
      await addBooking({
        username,
        roomId: Number(roomForm.roomId),
        roomNumber: room.number,
        nights: Number(roomForm.nights)
      })

      // 🔔 Notify admin
      await addNotification({
        to: 'admin',
        title: 'New room booking',
        body: `User ${username} requested room ${room.number}`,
        meta: { type: 'booking', kind: 'room' }
      })

      // 🔔 Notify the owner of the room
      if (room?.owner) {
        await addNotification({
          to: room.owner,
          title: 'New booking request',
          body: `User ${username} requested room ${room.number}`,
          meta: { bookingType: 'room' }
        })
      }

      setRoomForm({ roomId:'', nights:1 })
      await loadAll()
      alert('Room booking requested (pending approval)')
    } catch (err) {
      console.error('room booking error', err)
      alert('Failed to create room booking')
    }
  }

  return (
    <div className="container" style={{paddingTop:20}}>
      <h1 className="page-title">Welcome, {username || 'Guest'}</h1>

      {loading && <div className="small">Loading...</div>}

      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
        <div className="card">
          <h3 style={{marginTop:0}}>Available Menus</h3>
          {menus.length === 0 && <div className="small">No menus available.</div>}
          <div style={{marginTop:8, display:'grid', gap:8}}>
            {menus.map(m => (
              <div key={m.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <strong>{m.name}</strong>
                  <div className="small">{m.type} • ₹{m.price}</div>
                </div>
                <div className="small">ID: {m.id}</div>
              </div>
            ))}
          </div>

          <hr style={{margin:'12px 0'}} />

          <h4>Create Food Booking</h4>
          <form onSubmit={handleFoodBooking} style={{display:'grid', gap:8, marginTop:8, maxWidth:420}}>
            <select className="input" value={foodForm.menuId} onChange={e=>setFoodForm({...foodForm, menuId:e.target.value})}>
              <option value="">-- select menu --</option>
              {menus.map(m => <option key={m.id} value={m.id}>{m.name} ({m.type}) — ₹{m.price}</option>)}
            </select>
            <label className="small">Nights</label>
            <input className="input" type="number" min="1" value={foodForm.nights} onChange={e=>setFoodForm({...foodForm, nights:e.target.value})} />
            <button className="btn-primary" type="submit">Request Food Booking</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{marginTop:0}}>Available Rooms</h3>
          {rooms.length === 0 && <div className="small">No rooms available.</div>}
          <div style={{marginTop:8, display:'grid', gap:8}}>
            {rooms.map(r => (
              <div key={r.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <strong>{r.number}</strong>
                  <div className="small">{r.type} • ₹{r.price} • {r.available ? 'Available' : 'Not available'}</div>
                </div>
                <div className="small">ID: {r.id}</div>
              </div>
            ))}
          </div>

          <hr style={{margin:'12px 0'}} />

          <h4>Create Room Booking</h4>
          <form onSubmit={handleRoomBooking} style={{display:'grid', gap:8, marginTop:8, maxWidth:420}}>
            <select className="input" value={roomForm.roomId} onChange={e=>setRoomForm({...roomForm, roomId:e.target.value})}>
              <option value="">-- select room --</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id} disabled={!r.available}>
                  {r.number} ({r.type}) — ₹{r.price} {r.available ? '' : '(Not available)'}
                </option>
              ))}
            </select>
            <label className="small">Nights</label>
            <input className="input" type="number" min="1" value={roomForm.nights} onChange={e=>setRoomForm({...roomForm, nights:e.target.value})} />
            <button className="btn-primary" type="submit">Request Room Booking</button>
          </form>
        </div>
      </section>

      <section style={{marginTop:16}}>
        <div className="card">
          <h3 style={{marginTop:0}}>Your Bookings</h3>
          {bookings.length === 0 && <div className="small">You have no bookings.</div>}
          <div style={{marginTop:8}}>
            {bookings.map(b => (
              <div key={b.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px dashed #eee'}}>
                <div>
                  <div><strong>Booking #{b.id}</strong> • <span className="small">{b.status}</span></div>
                  <div className="small">
                    {b.menuId ? <>Food — Menu ID: {b.menuId}</> : null}
                    {b.roomId ? <>Room — {b.roomNumber} (ID: {b.roomId})</> : null}
                  </div>
                  <div className="small">Nights: {b.nights || '-'}</div>
                </div>
                <div className="small">{new Date(b.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
