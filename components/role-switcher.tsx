"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RoleSwitcherProps {
  userId: string;
  currentRole: string;
  currentUserId: string;
}

export function RoleSwitcher({ userId, currentRole, currentUserId }: RoleSwitcherProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isSelf = userId === currentUserId;

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;

    setIsPending(true);
    try {
      const result = await updateUserRole(userId, newRole as any);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar papel do usuário");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentRole}
        onValueChange={handleRoleChange}
        disabled={isPending || isSelf}
      >
        <SelectTrigger className={`w-[140px] h-8 text-[11px] font-bold uppercase tracking-wider ${
          currentRole === "super_admin" ? "bg-orange-600/10 text-orange-700 border-orange-200" :
          currentRole === "admin" ? "bg-blue-100 text-blue-700 border-blue-200" :
          "bg-muted text-muted-foreground border-transparent"
        }`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Usuário</SelectItem>
          <SelectItem value="admin">Administrador</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
