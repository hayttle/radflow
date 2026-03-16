"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { createClient } from "@/lib/supabase/client";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

interface UserProfileProps {
  userEmail?: string;
  userName?: string;
  avatarUrl?: string;
  variant?: "default" | "sidebar";
}

export function UserProfile({ userEmail, userName, avatarUrl, variant = "default" }: UserProfileProps) {
  const isSidebar = variant === "sidebar";
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            isSidebar
              ? "flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-sidebar-accent transition-colors"
              : "flex cursor-pointer items-center gap-2 rounded-full overflow-hidden outline-none border-0 focus:ring-2 focus:ring-ring focus:ring-offset-2"
          }
        >
          <Avatar className={isSidebar ? "h-8 w-8 shrink-0" : "h-9 w-9"}>
            <AvatarImage src={avatarUrl} alt={userName ?? userEmail} />
            <AvatarFallback className="bg-primary/10">
              {(userName ?? userEmail)?.substring(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
          {isSidebar && (
            <div className="flex min-w-0 flex-1 flex-col truncate">
              <span className="truncate text-sm font-medium">
                {userName || "Usuário"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {userEmail || ""}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName || userEmail || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes/perfil" className="flex cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes/plano" className="flex cursor-pointer items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Plano e Faturamento</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
