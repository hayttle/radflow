"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleUserActive } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UserActiveToggleProps {
  userId: string;
  isActive: boolean;
  currentUserId: string;
}

export function UserActiveToggle({ userId, isActive, currentUserId }: UserActiveToggleProps) {
  const [isPending, setIsPending] = useState(false);
  const [active, setActive] = useState(isActive);
  const isSelf = userId === currentUserId;

  const handleToggle = async (checked: boolean) => {
    if (isSelf) return;

    setIsPending(true);
    try {
      const result = await toggleUserActive(userId, checked);
      if (result.success) {
        toast.success(result.message);
        setActive(checked);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao alterar status do usuário");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={active}
        onCheckedChange={handleToggle}
        disabled={isPending || isSelf}
        aria-label="Alternar status do usuário"
      />
      <span className={`text-[10px] font-medium ${active ? 'text-emerald-600' : 'text-muted-foreground'}`}>
        {active ? 'Ativo' : 'Inativo'}
      </span>
      {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
