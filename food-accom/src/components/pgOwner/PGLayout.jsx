import { NavLink, Outlet } from "react-router-dom";
import "./pgLayout.css";

export default function PGLayout() {
  return (
    <div className="pg-layout">
      {/* Sidebar */}
      <aside className="pg-sidebar">
        <h2>PG Owner</h2>

        <NavLink to="/owner/pg/dashboard">Dashboard</NavLink>
        <NavLink to="/owner/pg/profile">Profile</NavLink>
        <NavLink to="/owner/pg/rooms">Rooms</NavLink>
      </aside>

      {/* Main Content */}
      <main className="pg-main">
        <Outlet />
      </main>
    </div>
  );
}
