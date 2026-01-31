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

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOwners: 0, activeBookings: 0, pendingApprovals: 0 });
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [view, setView] = useState('dashboard'); // dashboard, users, owners, approvals

  useEffect(() => {
    fetchStats();
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
    }
  };

  const loadOwners = async () => {
    try {
      const res = await getAllOwners();
      setOwners(res.data);
      setView('owners');
    } catch (err) {
      console.error("Error fetching owners", err);
    }
  };

  const loadPending = async () => {
    try {
      const res = await getPendingOwners();
      setPendingOwners(res.data);
      setView('approvals');
    } catch (err) {
      console.error("Error fetching pending owners", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveOwner(id);
      alert("Owner Approved");
      loadPending();
      fetchStats();
    } catch (err) {
      alert("Error approving owner");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this owner?")) return;
    try {
      await rejectOwner(id);
      alert("Owner Rejected");
      loadPending();
      fetchStats();
    } catch (err) {
      alert("Error rejecting owner");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      loadUsers();
      fetchStats();
    } catch (err) {
      alert("Error deleting user");
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8' }}>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>

        {/* Sidebar */}
        <div style={{ width: '250px', background: '#fff', padding: '20px', borderRight: '1px solid #ddd' }}>
          <h3>Admin Panel</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li onClick={() => setView('dashboard')} style={{ ...styles.menuItem, fontWeight: view === 'dashboard' ? 'bold' : 'normal' }}>Dashboard</li>
            <li onClick={loadUsers} style={{ ...styles.menuItem, fontWeight: view === 'users' ? 'bold' : 'normal' }}>Manage Users</li>
            <li onClick={loadOwners} style={{ ...styles.menuItem, fontWeight: view === 'owners' ? 'bold' : 'normal' }}>Manage Owners</li>
            <li onClick={loadPending} style={{ ...styles.menuItem, fontWeight: view === 'approvals' ? 'bold' : 'normal' }}>
              Pending Approvals
              {stats.pendingApprovals > 0 && <span style={styles.badge}>{stats.pendingApprovals}</span>}
            </li>
          </ul>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>

          {view === 'dashboard' && (
            <div>
              <h2>Dashboard Overview</h2>
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <StatCard title="Total Users" value={stats.totalUsers} color="#3b82f6" />
                <StatCard title="Total Owners" value={stats.totalOwners} color="#10b981" />
                <StatCard title="Pending Approvals" value={stats.pendingApprovals} color="#f59e0b" />
                <StatCard title="Revenue (Demo)" value="₹0" color="#6366f1" />
              </div>
            </div>
          )}

          {view === 'users' && (
            <div>
              <h2>Manage Users</h2>
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
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={styles.td}>{u.id}</td>
                      <td style={styles.td}>{u.firstName} {u.lastName}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.role}</td>
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

        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }) => (
  <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1, borderLeft: `4px solid ${color}` }}>
    <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>{title}</h3>
    <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
  </div>
);

const styles = {
  menuItem: { padding: '10px', cursor: 'pointer', borderRadius: '4px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' },
  badge: { background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { textAlign: 'left', padding: '12px', background: '#f9fafb', borderBottom: '1px solid #ddd' },
  td: { padding: '12px', borderBottom: '1px solid #eee' },
  card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  approveBtn: { background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  rejectBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};
