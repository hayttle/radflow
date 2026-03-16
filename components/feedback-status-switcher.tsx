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
import { updateFeedbackStatus } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FeedbackStatusSwitcherProps {
  feedbackId: string;
  currentStatus: "pending" | "viewed" | "resolved";
}

export function FeedbackStatusSwitcher({ feedbackId, currentStatus }: FeedbackStatusSwitcherProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsPending(true);
    try {
      const result = await updateFeedbackStatus(feedbackId, newStatus as any);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar status do feedback");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentStatus}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className={`w-[130px] h-8 text-[11px] font-semibold uppercase tracking-wider ${
          currentStatus === "pending" ? "bg-orange-100 text-orange-700 border-orange-200" :
          currentStatus === "resolved" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
          "bg-blue-100 text-blue-700 border-blue-200"
        }`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="viewed">Em Análise</SelectItem>
          <SelectItem value="resolved">Resolvido</SelectItem>
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
