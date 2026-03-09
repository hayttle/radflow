"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

function PatientsFilterInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";

  const buildUrl = useCallback(
    (updates: { q?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("q" in updates) {
        if (updates.q) params.set("q", updates.q);
        else params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const qVal = (formData.get("q") as string) ?? "";
    router.push(buildUrl({ q: qVal }));
  };

  const hasFilters = !!q;
  const clearUrl = pathname;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-end flex-wrap"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-q" className="text-xs text-muted-foreground">
            Pesquisar
          </Label>
          <Input
            key={`q-${q}`}
            id="filter-q"
            name="q"
            type="search"
            placeholder="Nome ou CPF do paciente"
            defaultValue={q}
            className="w-[220px] sm:w-[260px]"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm" className="gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          Filtrar
        </Button>
      </form>

      {hasFilters && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
        >
          <Link href={clearUrl}>
            <X className="h-3.5 w-3.5" />
            Limpar
          </Link>
        </Button>
      )}
    </div>
  );
}

export function PatientsFilter() {
  return (
    <Suspense
      fallback={
        <div className="h-10 animate-pulse rounded-md bg-muted" />
      }
    >
      <PatientsFilterInner />
    </Suspense>
  );
}
