import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import styles from "./registerStyles.js";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
    gender: "",
    city: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/login");
    } catch {
      alert("Registration failed");
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
          <input style={styles.input} name="name" placeholder="Name" onChange={handleChange} required />
          <input style={styles.input} name="mobileNo" placeholder="Mobile" onChange={handleChange} required />
          <input style={styles.input} name="email" placeholder="Email" onChange={handleChange} required />
          <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <select style={styles.select} name="gender" onChange={handleChange} required>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input style={styles.input} name="city" placeholder="City" onChange={handleChange} required />

          <button style={{ ...styles.button, gridColumn: "1 / -1" }}>
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
