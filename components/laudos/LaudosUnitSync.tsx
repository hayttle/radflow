"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useUnit } from "@/contexts/unit-context";

/**
 * Sincroniza a unidade do contexto com o cookie para que o Server Component possa filtrar.
 * Faz refresh quando a unidade muda (ex: usuário alterou no UnitSwitcher).
 */
export function LaudosUnitSync() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeUnitId } = useUnit();
  const lastRefreshedUnit = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== "/laudos") return;
    if (!activeUnitId) return;
    if (lastRefreshedUnit.current === activeUnitId) return;

    lastRefreshedUnit.current = activeUnitId;
    router.refresh();
  }, [pathname, activeUnitId, router]);

  return null;
}
