import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PGDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, available: 0 });
  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching PG dashboard data for User ID:", user.userId);

      const results = await Promise.allSettled([
        axios.get(`http://localhost:8080/api/rooms/owner/${user.userId}`),
        axios.get(`http://localhost:8080/api/bookings/owner/${user.userId}`),
        axios.get(`http://localhost:8080/api/ratings/${user.userId}`)
      ]);

      const [roomsRes, bookingsRes, ratingsRes] = results;

      // Handle Room Stats
      if (roomsRes.status === 'fulfilled') {
        console.log("Rooms Data:", roomsRes.value.data);
        const rooms = roomsRes.value.data;
        setStats({
          total: rooms.length,
          available: rooms.filter(r => r.availability).length
        });
      } else {
        console.error("Rooms API Failed:", roomsRes.reason);
      }

      // Handle Bookings
      if (bookingsRes.status === 'fulfilled') {
        console.log("Bookings Data:", bookingsRes.value.data);
        setBookings(bookingsRes.value.data);
      } else {
        console.error("Bookings API Failed:", bookingsRes.reason);
      }

      // Handle Ratings
      if (ratingsRes.status === 'fulfilled') {
        console.log("Ratings Data:", ratingsRes.value.data);
        setRatings(ratingsRes.value.data);
      } else {
        console.error("Ratings API Failed:", ratingsRes.reason);
      }

    } catch (err) {
      console.error("Critical error in PG dashboard fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=${status}`);
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: status } : b));
      // Simple alert for now, assuming toast is handled globally or user sees the update
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>PG Owner Dashboard</h1>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>Total Rooms</span>
          <span style={statValueStyle}>{stats.total}</span>
        </div>
        <div style={{ ...statBoxStyle, borderLeftColor: "#50e3c2" }}>
          <span style={statLabelStyle}>Available Rooms</span>
          <span style={statValueStyle}>{stats.available}</span>
        </div>
        <div style={{ ...statBoxStyle, borderLeftColor: "#9013fe" }}>
          <span style={statLabelStyle}>New Bookings</span>
          <span style={statValueStyle}>{bookings.filter(b => b.status === 'PENDING').length}</span>
        </div>
        <div style={{ ...statBoxStyle, borderLeftColor: "#10b981" }}>
          <span style={statLabelStyle}>Active Residents</span>
          <span style={statValueStyle}>{bookings.filter(b => b.status === 'ACCEPTED').length}</span>
        </div>
        <div style={{ ...statBoxStyle, borderLeftColor: "#f5a623" }}>
          <span style={statLabelStyle}>Reviews</span>
          <span style={statValueStyle}>{ratings.length}</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px",
        marginBottom: "40px"
      }}>
        <DashboardCard
          title="Manage Profile"
          desc="Update PG name, amenities, and contact details"
          onClick={() => navigate("/owner/pg/profile")}
          color="#764ba2"
          icon="👤"
        />
        <DashboardCard
          title="Manage Rooms"
          desc="Add new rooms, update pricing and availability"
          onClick={() => navigate("/owner/pg/rooms")}
          color="#50e3c2"
          icon="🛏️"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Bookings Section */}
        <div style={sectionCardStyle}>
          <h2 style={sectionTitleStyle}>Booking Requests</h2>
          {bookings.length === 0 ? <p style={emptyStateStyle}>No booking requests yet.</p> : (
            <div style={listStyle}>
              {bookings.map(booking => (
                <div key={booking.bookingId} style={itemStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0 }}>{booking.userName}</h4>
                    <span style={{ fontSize: '11px', color: '#888' }}>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: '0 0 5px', fontSize: '13px', color: '#555' }}>📞 {booking.userMobile}</p>
                  <p style={{ margin: 0, fontSize: '14px', background: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                    "{booking.message}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{
                      display: 'inline-block', fontSize: '11px', fontWeight: 'bold',
                      padding: '3px 8px', borderRadius: '12px',
                      background: booking.status === 'PENDING' ? '#fff7ed' : (booking.status === 'ACCEPTED' ? '#f0fdf4' : '#fef2f2'),
                      color: booking.status === 'PENDING' ? '#c2410c' : (booking.status === 'ACCEPTED' ? '#15803d' : '#991b1b')
                    }}>
                      {booking.status}
                    </span>

                    {booking.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStatusUpdate(booking.bookingId, 'ACCEPTED')}
                          style={{ ...actionBtnStyle, background: '#10b981', color: 'white' }}>
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.bookingId, 'REJECTED')}
                          style={{ ...actionBtnStyle, background: '#ef4444', color: 'white' }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ratings Section */}
        <div style={sectionCardStyle}>
          <h2 style={sectionTitleStyle}>Ratings & Reviews</h2>
          {ratings.length === 0 ? <p style={emptyStateStyle}>No ratings yet.</p> : (
            <div style={listStyle}>
              {ratings.map(rating => (
                <div key={rating.ratingId} style={itemStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{rating.userName}</h4>
                    <div style={{ color: '#f5a623' }}>{"⭐".repeat(rating.score)}</div>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#444' }}>"{rating.feedback}"</p>
                  <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Helper Component
const DashboardCard = ({ title, desc, onClick, color, icon }) => (
  <div
    onClick={onClick}
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "15px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
      cursor: "pointer",
      borderTop: `5px solid ${color}`,
      transition: "transform 0.2s, box-shadow 0.2s",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      height: "140px"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
    }}
  >
    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
    <h3 style={{ margin: "0 0 5px 0", color: "#333", fontSize: "18px" }}>{title}</h3>
    <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>{desc}</p>
  </div>
);

const statBoxStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  borderLeft: "6px solid #764ba2",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: "150px"
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

const sectionCardStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  height: 'fit-content'
};

const sectionTitleStyle = {
  fontSize: '20px',
  borderBottom: '1px solid #eee',
  paddingBottom: '15px',
  marginBottom: '15px',
  color: '#1e293b'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  maxHeight: '400px',
  overflowY: 'auto'
};

const itemStyle = {
  padding: '15px',
  borderRadius: '12px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0'
};

const emptyStateStyle = {
  color: '#94a3b8',
  textAlign: 'center',
  padding: '30px',
  fontStyle: 'italic'
};

const actionBtnStyle = {
  padding: '5px 10px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '11px',
  fontWeight: '700',
  cursor: 'pointer',
  textTransform: 'uppercase'
};
