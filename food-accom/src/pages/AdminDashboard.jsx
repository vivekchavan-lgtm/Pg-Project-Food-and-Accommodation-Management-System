// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react'
import AdminStatsCard from '../components/AdminStatsCard'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { 
  getMenus, 
  getBookings, 
  getUsers, 
  addMenu, 
  updateMenu, 
  deleteMenu, 
  updateBooking 
} from '../services/mockApi'
import { addNotification } from '../services/notifications'
import { useAuth } from '../contexts/AuthContext'

export default function AdminDashboard(){

  const { user } = useAuth()

  const [menus, setMenus] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(false)

  // Modal + form states
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [menuForm, setMenuForm] = useState({ name:'', type:'Lunch', price:0 })

  // Delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll(){
    setLoading(true)
    const [m, b, u] = await Promise.all([
      getMenus(),
      getBookings(),
      getUsers()
    ])
    setMenus(m)
    setBookings(b)
    setUsers(u)
    setLoading(false)
  }

  /* Menu actions */
  function openAddMenu(){
    setEditingMenu(null)
    setMenuForm({ name:'', type:'Lunch', price:0 })
    setMenuModalOpen(true)
  }

  function startEditMenu(m){
    setEditingMenu(m)
    setMenuForm({ name:m.name, type:m.type, price:m.price })
    setMenuModalOpen(true)
  }

  async function saveMenu(e){
    e?.preventDefault()
    if(!menuForm.name) return alert('Enter menu name')
    if(editingMenu){
      await updateMenu(editingMenu.id, menuForm)
      // notify admin (itself) — optionally notify others
      await addNotification({
        to: 'admin',
        title: 'Menu updated',
        body: `Menu "${menuForm.name}" was updated.`,
        meta: { menuId: editingMenu.id }
      })
      setEditingMenu(null)
    } else {
      const added = await addMenu(menuForm)
      await addNotification({
        to: 'admin',
        title: 'Menu added',
        body: `Menu "${menuForm.name}" was added (id: ${added.id}).`,
        meta: { menu: added }
      })
    }
    setMenuForm({ name:'', type:'Lunch', price:0 })
    await loadAll()
  }

  function confirmDeleteMenu(id){
    setMenuToDelete(id)
    setConfirmOpen(true)
  }

  async function doDeleteMenu(){
    if(!menuToDelete) return setConfirmOpen(false)
    await deleteMenu(menuToDelete)
    await addNotification({
      to: 'admin',
      title: 'Menu deleted',
      body: `Menu id ${menuToDelete} was deleted.`,
      meta: { menuId: menuToDelete }
    })
    setConfirmOpen(false)
    setMenuToDelete(null)
    await loadAll()
  }

  /* Booking actions */
  async function handleBookingStatus(id, status){
    await updateBooking(id, { status })
    // notify everyone relevant
    const booking = bookings.find(b => b.id === id)
    await addNotification({
      to: 'all',
      title: `Booking #${id} ${status}`,
      body: `Booking #${id} has been ${status} by admin.`,
      meta: { bookingId: id, status }
    })
    if (booking) {
      if (booking.username) {
        await addNotification({
          to: booking.username,
          title: `Your booking #${id} ${status}`,
          body: `Your booking was ${status} by admin.`,
          meta: { bookingId: id, status }
        })
      }
      if (booking.owner) {
        await addNotification({
          to: booking.owner,
          title: `Booking #${id} ${status}`,
          body: `A booking for your item was ${status} by admin.`,
          meta: { bookingId: id, status }
        })
      }
    }
    await loadAll()
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const approvedCount = bookings.filter(b => b.status === 'approved').length

  return (
    <div className="container" style={{paddingTop:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="small">Signed in as <strong>{user?.username}</strong></div>
      </div>

      <section style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:12}}>
        <AdminStatsCard title="Total Menus" value={menus.length} />
        <AdminStatsCard title="Bookings (pending)" value={pendingCount} />
        <AdminStatsCard title="Bookings (approved)" value={approvedCount} />
      </section>

      <section style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12, marginTop:12}}>
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{marginTop:0}}>Bookings</h3>
              <div className="small">Total: {bookings.length}</div>
            </div>

            {bookings.length === 0 && <div className="small" style={{marginTop:8}}>No bookings yet.</div>}
            <div style={{marginTop:8}}>
              {bookings.map(b => (
                <div key={b.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px dashed #eee'}}>
                  <div>
                    <div><strong>#{b.id}</strong> <span className="small">by {b.username}</span></div>
                    <div className="small">Menu: {b.menuId} • Room: {b.roomNumber} • Nights: {b.nights}</div>
                    <div className="small">Status: {b.status}</div>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', gap:6}}>
                    <button className="btn-primary" onClick={()=>handleBookingStatus(b.id,'approved')}>Approve</button>
                    <button className="btn-link" onClick={()=>handleBookingStatus(b.id,'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{marginTop:0}}>All Menus</h3>
              <div>
                <button className="btn-primary" onClick={openAddMenu}>Add Menu</button>
              </div>
            </div>

            <div style={{marginTop:8}}>
              {menus.map(m => (
                <div key={m.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px dashed #eee'}}>
                  <div>
                    <div><strong>{m.name}</strong></div>
                    <div className="small">{m.type} • ₹{m.price}</div>
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn-link" onClick={()=>startEditMenu(m)}>Edit</button>
                    <button className="btn-link" onClick={()=>confirmDeleteMenu(m.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div className="card">
            <h3 style={{marginTop:0}}>Users</h3>
            <div className="small" style={{marginTop:8}}>Total users: {users.length}</div>
            <div style={{marginTop:8}}>
              {users.map(u => (
                <div key={u.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px dashed #eee'}}>
                  <div>
                    <div><strong>{u.username}</strong></div>
                    <div className="small">Role: {u.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <h3 style={{marginTop:0}}>Quick Actions</h3>
            <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:8}}>
              <button className="btn-primary" onClick={loadAll}>Refresh</button>
              <button className="btn-link" onClick={()=>{ setMenus([]); setBookings([]); setUsers([]) }}>Clear View</button>
            </div>
          </div>
        </aside>
      </section>

      {/* Menu modal */}
      <Modal open={menuModalOpen} title={editingMenu ? 'Edit Menu' : 'Add Menu'} onClose={()=>setMenuModalOpen(false)}>
        <form onSubmit={saveMenu} style={{display:'grid', gap:8}}>
          <input className="input" placeholder="Menu name" value={menuForm.name} onChange={e=>setMenuForm({...menuForm, name:e.target.value})} />
          <select className="input" value={menuForm.type} onChange={e=>setMenuForm({...menuForm, type:e.target.value})}>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
          <input className="input" type="number" value={menuForm.price} onChange={e=>setMenuForm({...menuForm, price:Number(e.target.value)})} />
          <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
            <button className="btn-link" type="button" onClick={()=>setMenuModalOpen(false)}>Cancel</button>
            <button className="btn-primary" type="submit">{editingMenu ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirmOpen} title="Delete menu?" onCancel={()=>setConfirmOpen(false)} onConfirm={doDeleteMenu}>
        <div className="small">This will permanently remove the menu from local data (you can change this later to call an API).</div>
      </ConfirmDialog>

    </div>
  )
}
