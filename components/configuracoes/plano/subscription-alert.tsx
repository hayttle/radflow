"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function SubscriptionAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "unsubscribed") {
      toast.error("Assinatura Necessária", {
        description: "Seu acesso está restrito. Por favor, regularize sua assinatura ou ative um plano para continuar utilizando o sistema.",
        duration: 8000,
      });
    }
  }, [error]);

  return null;
}
