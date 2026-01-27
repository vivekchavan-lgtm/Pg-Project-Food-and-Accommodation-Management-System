import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserAvatar from "./UserAvatar";

interface NavigationProps {
  username?: string; // optional for avatar fallback
}

const Navigation: React.FC<NavigationProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background shadow-sm">
      {/* Left side: Logo + PG + Mess */}
      <div className="flex items-center gap-4">
        <h1
          className="text-xl font-semibold cursor-pointer"
          onClick={() => navigate("/home")}
        >
          PG & Mess
        </h1>

        <Button variant="ghost" onClick={() => navigate("/pg")}>
          PG
        </Button>
        <Button variant="ghost" onClick={() => navigate("/mess")}>
          Mess
        </Button>
      </div>

      {/* Right side: Profile + Avatar + Logout */}
      <div className="flex items-center gap-4">
        <UserAvatar username="Rahul" imageUrl="https://github.com/shadcn.png" />

        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
