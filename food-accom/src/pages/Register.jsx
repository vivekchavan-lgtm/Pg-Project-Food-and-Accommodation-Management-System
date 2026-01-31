import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import styles from "./registerStyles.js";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
    city: "",
    role: "USER",
    ownerType: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      gender: form.gender.toUpperCase(),
      ownerType: form.role === "OWNER" ? form.ownerType : null,
    };

    try {
      await registerUser(payload);
      alert("Registration successful! Please login to complete your profile.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join Food & PG Finder</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* First Name & Last Name */}
          <div style={{ display: "flex", gap: "10px", gridColumn: "1 / -1" }}>
            <input style={{ ...styles.input, flex: 1 }} name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input style={{ ...styles.input, flex: 1 }} name="lastName" placeholder="Last Name" onChange={handleChange} required />
          </div>

          <input style={styles.input} name="mobile" placeholder="Mobile" onChange={handleChange} required />
          <input style={styles.input} name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <div style={{ display: "flex", gap: "10px", gridColumn: "1 / -1" }}>
            <select style={{ ...styles.select, flex: 1 }} name="gender" onChange={handleChange} required>
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input style={{ ...styles.input, flex: 1 }} name="city" placeholder="City" onChange={handleChange} required />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", alignItems: "center" }}>
            <label>Register as:</label>
            <select style={{ ...styles.select, width: "auto" }} name="role" value={form.role} onChange={handleChange}>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>

          {form.role === "OWNER" && (
            <div style={{ gridColumn: "1 / -1" }}>
              <select style={{ ...styles.select, width: "100%", marginTop: "5px" }} name="ownerType" value={form.ownerType} onChange={handleChange} required>
                <option value="">Select Service Type</option>
                <option value="PG">PG Owner</option>
                <option value="MESS">Mess Owner</option>
              </select>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>* You will verify and complete your profile details after login.</p>
            </div>
          )}

          <button style={{ ...styles.button, gridColumn: "1 / -1", marginTop: "10px" }}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
