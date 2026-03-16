"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getCustomerPortalUrl } from "@/lib/stripe/actions";

export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  const handleManage = () => {
    startTransition(async () => {
      try {
        const url = await getCustomerPortalUrl();
        window.open(url, "_blank");
      } catch (error) {
        console.error("Failed to open billing portal:", error);
      }
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2" 
      onClick={handleManage}
      disabled={isPending}
    >
      {isPending ? "Carregando..." : "Gerenciar Assinatura"}
      <ExternalLink className="w-4 h-4" />
    </Button>
  );
}
