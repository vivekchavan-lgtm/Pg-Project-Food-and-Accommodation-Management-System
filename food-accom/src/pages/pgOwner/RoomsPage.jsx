import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = "http://localhost:8080/api/rooms";

export default function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  // Form State
  const [form, setForm] = useState({
    roomNumber: "",
    price: "",
    capacity: "",
    availability: true,
    facilities: "",
  });

  useEffect(() => {
    if (user?.userId) {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log("DEBUG: RoomsPage - Fetching rooms for ownerId:", user?.userId);
      const res = await axios.get(`${API_URL}/owner/${user.userId}`);
      console.log("DEBUG: RoomsPage - Fetch result:", res.data);
      setRooms(res.data);
    } catch (err) {
      console.error("DEBUG: RoomsPage - Fetch failed", err);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("DEBUG: RoomsPage - Submitting form:", form);
      if (currentRoom) {
        // Update
        const res = await axios.put(`${API_URL}/${currentRoom.roomId}`, form);
        console.log("DEBUG: RoomsPage - Update response:", res.data);
      } else {
        // Add
        const res = await axios.post(`${API_URL}/owner/${user.userId}`, form);
        console.log("DEBUG: RoomsPage - Add response:", res.data);
      }
      setShowModal(false);
      resetForm();
      fetchRooms();
      toast.success(currentRoom ? "Room updated!" : "Room added!");
    } catch (err) {
      console.error("DEBUG: RoomsPage - Save failed", err);
      toast.error("Error saving room. Please try again.");
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom(room);
    setForm({
      roomNumber: room.roomNumber,
      price: room.price,
      capacity: room.capacity,
      availability: room.availability,
      facilities: room.facilities || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${API_URL}/${roomId}`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to delete room", err);
    }
  };

  const resetForm = () => {
    setCurrentRoom(null);
    setForm({
      roomNumber: "",
      price: "",
      capacity: "",
      availability: true,
      facilities: "",
    });
  };

  if (loading) return <div>Loading Rooms...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Manage Rooms</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          style={addBtnStyle}
        >
          + Add New Room
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {rooms.length === 0 ? (
          <p>No rooms found. Add your first room!</p>
        ) : (
          rooms.map((room) => (
            <div key={room.roomId} style={roomCardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: 0 }}>Room {room.roomNumber}</h3>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  background: room.availability ? "#dcfce7" : "#fee2e2",
                  color: room.availability ? "#166534" : "#991b1b"
                }}>
                  {room.availability ? "Available" : "Occupied"}
                </span>
              </div>
              <p style={{ margin: "10px 0" }}><strong>Price:</strong> ₹{room.price} / month</p>
              <p style={{ margin: "5px 0" }}><strong>Capacity:</strong> {room.capacity} Person(s)</p>
              <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}><strong>Facilities:</strong> {room.facilities || "None"}</p>

              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button onClick={() => handleEdit(room)} style={editBtnStyle}>Edit</button>
                <button onClick={() => handleDelete(room.roomId)} style={deleteBtnStyle}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>{currentRoom ? "Edit Room" : "Add New Room"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={labelStyle}>Room Number</label>
                <input
                  style={inputStyle}
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 101, A2"
                />
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Price (₹)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Capacity</label>
                  <input
                    style={inputStyle}
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Facilities</label>
                <textarea
                  style={inputStyle}
                  name="facilities"
                  value={form.facilities}
                  onChange={handleChange}
                  placeholder="e.g. AC, Attached Bath, Study Table"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  name="availability"
                  checked={form.availability}
                  onChange={handleChange}
                />
                <label>Is Available for Booking?</label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" style={saveBtnStyle}>{currentRoom ? "Update Room" : "Add Room"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styles
const addBtnStyle = {
  padding: "10px 20px",
  background: "#50e3c2",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(80, 227, 194, 0.3)"
};

const roomCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  border: "1px solid #eee"
};

const editBtnStyle = {
  flex: 1,
  padding: "8px",
  background: "#e2e8f0",
  color: "#475569",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500"
};

const deleteBtnStyle = {
  flex: 1,
  padding: "8px",
  background: "#fee2e2",
  color: "#991b1b",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500"
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContentStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "15px",
  width: "450px",
  maxWidth: "90%",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#475569"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box"
};

const saveBtnStyle = {
  padding: "10px 20px",
  background: "#1e293b",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

const cancelBtnStyle = {
  padding: "10px 20px",
  background: "transparent",
  color: "#64748b",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  cursor: "pointer"
};
