import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    confirmPassword: "",
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

    // Mobile Validation: Exactly 10 digits
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(form.mobile)) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }

    // Password Validation
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(form.password)) {
      toast.error("Password must be at least 6 characters long and include: 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character.");
      return;
    }

    setLoading(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      mobile: form.mobile,
      gender: form.gender.toUpperCase(),
      city: form.city,
      role: form.role,
      ownerType: form.role === "OWNER" ? form.ownerType : null,
    };

    try {
      await registerUser(payload);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join Us !!!</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* First Name & Last Name */}
          <div style={{ display: "flex", gap: "10px", gridColumn: "1 / -1" }}>
            <input style={{ ...styles.input, flex: 1 }} name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input style={{ ...styles.input, flex: 1 }} name="lastName" placeholder="Last Name" onChange={handleChange} required />
          </div>

          <input style={styles.input} name="mobile" placeholder="Mobile" maxLength="10" onChange={handleChange} required />
          <input style={styles.input} name="email" type="email" placeholder="Email" onChange={handleChange} required />

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

          {/* Password Section (Moved to Bottom) */}
          <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input style={styles.input} name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
          <p style={{ fontSize: '11px', color: '#666', margin: '-5px 0 10px 5px', gridColumn: "1 / -1" }}>
            * Min 6 chars: 1 Upper, 1 Lower, 1 Number, 1 Special Char
          </p>

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
