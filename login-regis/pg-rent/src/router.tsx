import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import HomePage from "./pages/HomePage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
