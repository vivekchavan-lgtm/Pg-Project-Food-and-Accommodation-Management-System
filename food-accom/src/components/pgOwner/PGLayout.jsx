import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./PGLayout.css";

export default function PGLayout() {
  const { user, logout } = useAuth();
  console.log("DEBUG: PGLayout User Data Keys:", user ? Object.keys(user) : "No User");
  console.log("DEBUG: user.name value:", user?.name);

  const displayName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "PG Owner");

  return (
    <div className="pg-layout">
      {/* Sidebar */}
      <aside className="pg-sidebar">
        <h2 style={{ color: 'white' }}>{displayName}</h2>
        <div className="sidebar-links">
          <NavLink to="/owner/pg/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/owner/pg/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
          <NavLink to="/owner/pg/rooms" className={({ isActive }) => isActive ? "active" : ""}>Rooms</NavLink>
          <NavLink to="/owner/pg/ratings" className={({ isActive }) => isActive ? "active" : ""}>Ratings</NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pg-container">
        {/* New Owner Navbar */}
        <header className="owner-header">
          <div className="header-left">
            <span>Welcome, <strong>{displayName}</strong></span>
          </div>
          <button onClick={logout} className="logout-btn">Logout</button>
        </header>

        <main className="pg-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
