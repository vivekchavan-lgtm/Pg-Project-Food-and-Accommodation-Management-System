import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.ownerType === "PG") {
      navigate("/owner/pg/dashboard");
    } else if (user.ownerType === "MESS") {
      navigate("/owner/mess/dashboard");
    }
  }, [user, navigate]);

  return <p style={{ padding: 20 }}>Redirecting owner dashboard...</p>;
}
