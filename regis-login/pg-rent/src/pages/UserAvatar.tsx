import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface UserAvatarProps {
  username?: string;
  imageUrl?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, imageUrl }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={username} />
          ) : (
            <AvatarFallback>
              {username ? username[0].toUpperCase() : "U"}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
          Edit Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
