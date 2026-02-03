import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = "http://localhost:8080/api/mess/menu";

export default function MenuPage() {
    const { user } = useAuth();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // Form State
    const [form, setForm] = useState({
        itemName: "",
        price: "",
        category: "LUNCH", // Default
        available: true,
    });

    useEffect(() => {
        if (user?.userId) {
            fetchMenu();
        }
    }, [user]);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            console.log("DEBUG: MenuPage - Fetching menu for ownerId:", user?.userId);
            const res = await axios.get(`${API_URL}/owner/${user.userId}`);
            console.log("DEBUG: MenuPage - Fetch result:", res.data);
            setMenuItems(res.data);
        } catch (err) {
            console.error("DEBUG: MenuPage - Fetch failed", err);
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
            console.log("DEBUG: MenuPage - Submitting form:", form);
            if (currentItem) {
                // Update
                const res = await axios.put(`${API_URL}/${currentItem.menuId}`, form);
                console.log("DEBUG: MenuPage - Update response:", res.data);
            } else {
                // Add
                const res = await axios.post(`${API_URL}/owner/${user.userId}`, form);
                console.log("DEBUG: MenuPage - Add response:", res.data);
            }
            setShowModal(false);
            resetForm();
            fetchMenu();
            toast.success(currentItem ? "Item updated!" : "Item added!");
        } catch (err) {
            console.error("DEBUG: MenuPage - Save failed", err);
            toast.error("Error saving item. Please try again.");
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setForm({
            itemName: item.itemName,
            price: item.price,
            category: item.category,
            available: item.available,
        });
        setShowModal(true);
    };

    const handleDelete = async (menuId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await axios.delete(`${API_URL}/${menuId}`);
            fetchMenu();
        } catch (err) {
            console.error("Failed to delete item", err);
        }
    };

    const resetForm = () => {
        setCurrentItem(null);
        setForm({
            itemName: "",
            price: "",
            category: "LUNCH",
            available: true,
        });
    };

    if (loading) return <div>Loading Menu...</div>;

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2>Manage Mess Menu</h2>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    style={addBtnStyle}
                >
                    + Add New Item
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {menuItems.length === 0 ? (
                    <p>No items found. Add your first dish!</p>
                ) : (
                    menuItems.map((item) => (
                        <div key={item.menuId} style={cardStyle}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{item.itemName}</h3>
                                    <span style={categoryBadgeStyle}>{item.category}</span>
                                </div>
                                <span style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    background: item.available ? "#dcfce7" : "#fee2e2",
                                    color: item.available ? "#166534" : "#991b1b"
                                }}>
                                    {item.available ? "In Stock" : "Unavailable"}
                                </span>
                            </div>
                            <p style={{ margin: "15px 0", fontSize: "18px", fontWeight: "bold", color: "#e056fd" }}>₹{item.price}</p>

                            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                                <button onClick={() => handleEdit(item)} style={editBtnStyle}>Edit</button>
                                <button onClick={() => handleDelete(item.menuId)} style={deleteBtnStyle}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{currentItem ? "Edit Menu Item" : "Add New Menu Item"}</h3>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div>
                                <label style={labelStyle}>Item Name</label>
                                <input
                                    style={inputStyle}
                                    name="itemName"
                                    value={form.itemName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Veg Thali, Chicken Biryani"
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
                                    <label style={labelStyle}>Category</label>
                                    <select
                                        style={inputStyle}
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                    >
                                        <option value="BREAKFAST">Breakfast</option>
                                        <option value="LUNCH">Lunch</option>
                                        <option value="DINNER">Dinner</option>
                                        <option value="SNACKS">Snacks</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={form.available}
                                    onChange={handleChange}
                                />
                                <label>Available today?</label>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={saveBtnStyle}>{currentItem ? "Update Item" : "Add Item"}</button>
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
    background: "#e056fd",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(224, 86, 253, 0.3)"
};

const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    border: "1px solid #eee"
};

const categoryBadgeStyle = {
    fontSize: "11px",
    background: "#f1f5f9",
    color: "#475569",
    padding: "2px 6px",
    borderRadius: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "bold"
};

const editBtnStyle = {
    flex: 1,
    padding: "8px",
    background: "#f1f5f9",
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
