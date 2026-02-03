import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../services/authService";
import styles from "./loginStyles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      console.log("LOGIN RESPONSE:", res.data);

      login(res.data);
      toast.success("Login Successful!");

      if (res.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (res.data.role === "OWNER") {
        if (res.data.ownerType === "PG") {
          navigate("/owner/pg/dashboard");
        } else if (res.data.ownerType === "MESS") {
          navigate("/owner/mess/dashboard");
        } else {
          console.error("Unknown Owner Type");
          navigate("/login");
        }
      } else {
        navigate("/user/home");
      }
    } catch {
      toast.error("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
