import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "12px 20px", borderBottom: "1px solid #ddd" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>

        <Link to="/" style={{ fontWeight: "bold" }}>
          Food & PG Finder
        </Link>

        <div>
          {!user ? (
            <>
              <Link to="/login" style={{ marginRight: 12 }}>
                Sign In
              </Link>
              <Link to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: 10 }}>
                {user.name || user.email || "Logged In"} ({user.role})
              </span>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
