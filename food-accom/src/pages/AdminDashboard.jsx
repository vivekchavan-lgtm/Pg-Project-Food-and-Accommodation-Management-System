import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  getAllOwners,
  getPendingOwners,
  approveOwner,
  rejectOwner,
  deleteUser,
  disableUser,
  getStats
} from '../services/adminService';
import Navbar from '../components/Navbar';
import { toast } from "react-toastify";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOwners: 0, activeBookings: 0, pendingApprovals: 0 });
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [view, setView] = useState('dashboard'); // dashboard, users, owners, approvals
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('ALL');
  const { logout, user } = useAuth(); // Destructure user

  // Profile States
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', mobile: '', city: '', gender: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${user.userId}`);
      setUserData(res.data);
      setEditFormData({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        mobile: res.data.mobile || '',
        city: res.data.city || '',
        gender: res.data.gender || ''
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
      toast.error("Failed to load profile data");
    }
  };

  const submitEditProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/users/${user.userId}`, editFormData);
      toast.success("Profile updated successfully!");
      setShowEditModal(false);
      fetchUserProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  function submitChangePassword(e) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    axios.put(`http://localhost:8080/api/users/${user.userId}/password`, {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    })
      .then(() => {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Failed to change password");
      });
  }

  useEffect(() => {
    fetchStats();
    fetchPendingData();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setView('users');
    } catch (err) {
      console.error("Error fetching users", err);
      toast.error("Failed to load users");
    }
  };

  const loadOwners = async () => {
    try {
      const res = await getAllOwners();
      setOwners(res.data);
      setView('owners');
    } catch (err) {
      console.error("Error fetching owners", err);
      toast.error("Failed to load owners");
    }
  };

  const fetchPendingData = async () => {
    try {
      const res = await getPendingOwners();
      setPendingOwners(res.data);
    } catch (err) {
      console.error("Error fetching pending owners", err);
    }
  };

  const loadPending = async () => {
    await fetchPendingData();
    setView('approvals');
  };

  const handleApprove = async (id) => {
    try {
      await approveOwner(id);
      toast.success("Owner Approved");
      fetchPendingData();
      fetchStats();
    } catch (err) {
      toast.error("Error approving owner");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this owner?")) return;
    try {
      await rejectOwner(id);
      toast.info("Owner Rejected");
      fetchPendingData();
      fetchStats();
    } catch (err) {
      toast.error("Error rejecting owner");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      loadUsers();
      fetchStats();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Error deleting user");
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}>

      {/* Sidebar (Full Height) */}
      <div style={{
        width: '240px',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        padding: '30px 20px',
        color: 'white',
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>Admin Panel</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li onClick={() => setView('dashboard')} style={{ ...styles.menuItem, ...(view === 'dashboard' ? styles.activeMenuItem : {}) }}>Dashboard</li>
          <li onClick={loadUsers} style={{ ...styles.menuItem, ...(view === 'users' ? styles.activeMenuItem : {}) }}>Manage Users</li>
          <li onClick={loadOwners} style={{ ...styles.menuItem, ...(view === 'owners' ? styles.activeMenuItem : {}) }}>Manage Owners</li>
          <li onClick={loadPending} style={{ ...styles.menuItem, ...(view === 'approvals' ? styles.activeMenuItem : {}) }}>
            Pending Approvals
            {stats.pendingApprovals > 0 && <span style={styles.badge}>{stats.pendingApprovals}</span>}
          </li>
          <li onClick={() => { setView('profile'); fetchUserProfile(); }} style={{ ...styles.menuItem, ...(view === 'profile' ? styles.activeMenuItem : {}) }}>Profile</li>
        </ul>
      </div>

      {/* Main Content Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Custom Header */}
        <header style={{
          height: '70px',
          background: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <div>
            <span style={{ fontSize: '16px', color: '#334155' }}>Welcome, <strong>Admin</strong></span>
          </div>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '2px solid #ef4444',
              color: '#ef4444',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
          >
            Logout
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>

          {view === 'dashboard' && (
            <div>
              <h2 style={{ marginBottom: "20px", color: "#1e293b", fontWeight: "700" }}>Dashboard Overview</h2>
              <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
                <div style={statBoxStyle}>
                  <span style={statLabelStyle}>User Count</span>
                  <span style={statValueStyle}>{stats.totalUsers}</span>
                </div>
                <div style={{ ...statBoxStyle, borderLeftColor: "#10b981" }}>
                  <span style={statLabelStyle}>PG Owners</span>
                  <span style={statValueStyle}>{stats.pgOwners || 0}</span>
                </div>
                <div style={{ ...statBoxStyle, borderLeftColor: "#f5a623" }}>
                  <span style={statLabelStyle}>Mess Owners</span>
                  <span style={statValueStyle}>{stats.messOwners || 0}</span>
                </div>
                <div style={{ ...statBoxStyle, borderLeftColor: "#ef4444" }}>
                  <span style={statLabelStyle}>Pending Approvals</span>
                  <span style={statValueStyle}>{stats.pendingApprovals}</span>
                </div>
              </div>

              {/* Pending Approvals Section in Dashboard */}
              <h3 style={{ marginTop: '40px', marginBottom: '20px', color: '#1e293b' }}>Pending Requests</h3>
              {pendingOwners.length === 0 ? <p style={{ color: '#64748b' }}>No pending approvals.</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {pendingOwners.map(owner => (
                    <div key={owner.ownerId} style={styles.card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                        <span style={{ fontSize: '10px', background: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          {owner.ownerType}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{owner.ownerType === 'PG' ? owner.pgName : owner.messName}</h4>
                      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#475569' }}><strong>Owner:</strong> {owner.name}</p>
                      <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#64748b' }}>{owner.email}</p>
                      <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#64748b' }}>
                        <strong>ID:</strong> {owner.idCardType} - {owner.idCardNumber}
                      </p>
                      <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#64748b' }}>📍 {owner.address}</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleApprove(owner.ownerId)} style={styles.approveBtn}>Approve</button>
                        <button onClick={() => handleReject(owner.ownerId)} style={styles.rejectBtn}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: "#1e293b", fontWeight: "700" }}>Manage Users</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search by ID or Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outlineColor: '#764ba2', width: '220px' }}
                  />
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="ALL">All Roles</option>
                    <option value="USER">Users Only</option>
                    <option value="OWNER">Owners Only</option>
                  </select>
                </div>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => u.id.toString().includes(searchTerm) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .filter(u => sortType === 'ALL' || u.role === sortType)
                    .map(u => (
                      <tr key={u.id}>
                        <td style={styles.td}>{u.id}</td>
                        <td style={styles.td}>{u.firstName} {u.lastName}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold',
                            background: u.role === 'OWNER' ? '#e0e7ff' : (u.role === 'ADMIN' ? '#fce7f3' : '#f1f5f9'),
                            color: u.role === 'OWNER' ? '#4338ca' : (u.role === 'ADMIN' ? '#be185d' : '#475569')
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => handleDeleteUser(u.id)} style={styles.deleteBtn}>Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {view === 'owners' && (
            <div>
              <h2>All Owners</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Owner Name</th>
                    <th style={styles.th}>Business Name</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Avg Rating</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map(o => (
                    <tr key={o.ownerId}>
                      <td style={styles.td}>{o.ownerId}</td>
                      <td style={styles.td}>{o.name}</td>
                      <td style={styles.td}>{o.ownerType === 'PG' ? o.pgName : o.messName}</td>
                      <td style={styles.td}>{o.ownerType}</td>
                      <td style={styles.td}>
                        <OwnerRating ownerId={o.ownerId} />
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                          background: o.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                          color: o.status === 'ACTIVE' ? '#065f46' : '#991b1b'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={styles.td}>{o.contactNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === 'approvals' && (
            <div>
              <h2>Pending Approvals</h2>
              {pendingOwners.length === 0 ? <p>No pending approvals.</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {pendingOwners.map(owner => (
                    <div key={owner.ownerId} style={styles.card}>
                      <h4>{owner.ownerType === 'PG' ? owner.pgName : owner.messName} ({owner.ownerType})</h4>
                      <p><strong>Owner:</strong> {owner.name}</p>
                      <p><strong>Email:</strong> {owner.email}</p>
                      <p>
                        <strong>ID:</strong> {owner.idCardType} - {owner.idCardNumber}
                      </p>
                      <p><strong>Meta:</strong> {owner.address}</p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => handleApprove(owner.ownerId)} style={styles.approveBtn}>Approve</button>
                        <button onClick={() => handleReject(owner.ownerId)} style={styles.rejectBtn}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'profile' && userData && (
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Admin Profile</h2>
              <div style={{ marginBottom: '30px' }}>
                <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Mobile:</strong> {userData.mobile}</p>
                <p><strong>City:</strong> {userData.city || 'N/A'}</p>
                <p><strong>Role:</strong> <span style={styles.badge}>ADMIN</span></p>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setShowEditModal(true)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Edit Details</button>
                <button onClick={() => setShowPasswordModal(true)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Change Password</button>
              </div>
            </div>
          )}

          {/* Modals */}
          {showEditModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
                <h3>Edit Profile</h3>
                <form onSubmit={submitEditProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  <input placeholder="First Name" value={editFormData.firstName} onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })} style={styles.input} />
                  <input placeholder="Last Name" value={editFormData.lastName} onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })} style={styles.input} />
                  <input placeholder="Mobile" value={editFormData.mobile} onChange={e => setEditFormData({ ...editFormData, mobile: e.target.value })} style={styles.input} />
                  <input placeholder="City" value={editFormData.city} onChange={e => setEditFormData({ ...editFormData, city: e.target.value })} style={styles.input} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '8px 15px', borderRadius: '6px', border: 'none', background: '#ccc', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '8px 15px', borderRadius: '6px', border: 'none', background: '#764ba2', color: 'white', cursor: 'pointer' }}>Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showPasswordModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
                <h3>Change Password</h3>
                <form onSubmit={submitChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  <input type="password" placeholder="Old Password" value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} style={styles.input} required />
                  <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} style={styles.input} required />
                  <input type="password" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} style={styles.input} required />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={() => setShowPasswordModal(false)} style={{ padding: '8px 15px', borderRadius: '6px', border: 'none', background: '#ccc', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '8px 15px', borderRadius: '6px', border: 'none', background: '#f59e0b', color: 'white', cursor: 'pointer' }}>Update</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Replaced Styles to match Owner Dashboard Aesthetic
const statBoxStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  borderLeft: "6px solid #764ba2",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: "150px",
  transition: "transform 0.2s",
  cursor: "default"
};

const statLabelStyle = {
  fontSize: "12px",
  color: "#888",
  fontWeight: "700",
  textTransform: "uppercase",
  marginBottom: "5px",
  letterSpacing: '0.5px'
};

const statValueStyle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#333"
};

const OwnerRating = ({ ownerId }) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/ratings/${ownerId}/average`)
      .then(res => setRating(res.data))
      .catch(err => console.error(err));
  }, [ownerId]);

  return (
    <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>
      {rating > 0 ? `⭐ ${rating.toFixed(1)}` : 'N/A'}
    </span>
  );
};

const styles = {
  menuItem: { padding: '12px', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontWeight: '500', transition: 'all 0.2s' },
  activeMenuItem: { background: 'white', color: '#764ba2', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  badge: { background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  th: { textAlign: 'left', padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' },
  td: { padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  card: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  approveBtn: { background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  rejectBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  deleteBtn: { background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
};
