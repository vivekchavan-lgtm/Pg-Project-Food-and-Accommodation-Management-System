import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import { useAuth } from "./contexts/AuthContext";
import PGLayout from "./components/pgOwner/PGLayout";
import MessLayout from "./components/messOwner/MessLayout";


import Login from "./pages/Login";
import Register from "./pages/Register";
import UserLayout from "./pages/user/UserLayout";
import UserHome from "./pages/user/UserHome";
import SearchPage from "./pages/user/SearchPage";
import DetailsPage from "./pages/user/DetailsPage";
import UserProfile from "./pages/user/UserProfile";
import OwnerDashboard from "./pages/OwnerDashboard";
import PGDashboard from "./pages/pgOwner/PGDashboard";
import PGProfile from "./pages/pgOwner/PGProfile";
import RoomsPage from "./pages/pgOwner/RoomsPage";
import AdminDashboard from "./pages/AdminDashboard";
import MessDashboard from "./pages/messOwner/MessDashboard";
import OwnerDetails from "./pages/OwnerDetails";
import OwnerProfile from "./pages/OwnerProfile";
import MenuPage from "./pages/messOwner/MenuPage";
import OwnerRatings from "./pages/OwnerRatings";



// ---------------- Protected Route ----------------
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// ---------------- Admin Route ----------------
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
};

// ---------------- Owner Route ----------------
const OwnerRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("OwnerRoute user:", user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "OWNER") return <Navigate to="/" replace />;
  return children;
};

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />




      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes (Student) */}
        <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route path="home" element={<UserHome />} />
          <Route path="search/:type" element={<SearchPage />} />
          <Route path="pg/:id" element={<DetailsPage contentType="pg" />} />
          <Route path="mess/:id" element={<DetailsPage contentType="mess" />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* PG Owner Routes */}
        <Route path="/owner/pg" element={<OwnerRoute><PGLayout /></OwnerRoute>}>
          <Route path="dashboard" element={<PGDashboard />} />
          <Route path="profile" element={<OwnerProfile />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="ratings" element={<OwnerRatings />} />
        </Route>

        {/* Mess Owner Routes */}
        <Route path="/owner/mess" element={<OwnerRoute><MessLayout /></OwnerRoute>}>
          <Route path="dashboard" element={<MessDashboard />} />
          <Route path="profile" element={<OwnerProfile />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="ratings" element={<OwnerRatings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><div>User Management (Coming Soon)</div></AdminRoute>} />
        <Route path="/admin/owners" element={<AdminRoute><div>Owner Management (Coming Soon)</div></AdminRoute>} />
        <Route path="/admin/owners/pending" element={<AdminRoute><div>Pending Approvals (Coming Soon)</div></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
