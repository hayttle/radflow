"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type SubscriptionAlertProps = {
  /** true quando a assinatura está válida (evita toast se a URL ainda tiver ?error=unsubscribed) */
  hasAccess: boolean;
};

export function SubscriptionAlert({ hasAccess }: SubscriptionAlertProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryStr = searchParams.toString();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error !== "unsubscribed") return;

    if (hasAccess) {
      const params = new URLSearchParams(queryStr);
      params.delete("error");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      return;
    }

    toast.error("Assinatura Necessária", {
      id: "subscription-unsubscribed",
      description:
        "Seu acesso está restrito. Por favor, regularize sua assinatura ou ative um plano para continuar utilizando o sistema.",
      duration: 8000,
    });
    // Depende só de valores estáveis — evita reexecuções por nova referência de `searchParams`
    // (isso ajuda reconciliação / DevTools com React 19).
  }, [error, hasAccess, pathname, queryStr, router]);

  return null;
}
