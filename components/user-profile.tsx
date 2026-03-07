"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User } from "lucide-react";
import { LogoutButton } from "./logout-button";

interface UserProfileProps {
  userEmail?: string;
  avatarUrl?: string;
}

export function UserProfile({ userEmail, avatarUrl }: UserProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full overflow-hidden border">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={userEmail} />
            <AvatarFallback className="bg-primary/10">
              {userEmail?.substring(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userEmail || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div className="w-full">
            <LogoutButton />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
