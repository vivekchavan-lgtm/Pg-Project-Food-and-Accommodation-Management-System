import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./messLayout.css";

export default function MessLayout() {
    const { user, logout } = useAuth();
    console.log("DEBUG: MessLayout User Data:", user);

    const displayName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Mess Owner");

    return (
        <div className="mess-layout">
            {/* Sidebar */}
            <aside className="mess-sidebar">
                <h2 style={{ color: 'white' }}>{displayName}</h2>
                <div className="sidebar-links">
                    <NavLink to="/owner/mess/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
                    <NavLink to="/owner/mess/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
                    <NavLink to="/owner/mess/menu" className={({ isActive }) => isActive ? "active" : ""}>Menu</NavLink>
                    <NavLink to="/owner/mess/ratings" className={({ isActive }) => isActive ? "active" : ""}>Ratings</NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <div className="mess-container">
                <header className="owner-header">
                    <div className="header-left">
                        <span>Welcome, <strong>{displayName}</strong></span>
                    </div>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </header>

                <main className="mess-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
