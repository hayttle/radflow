"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export interface StatusOption {
  label: string;
  value: string | undefined;
}

interface DataFilterProps {
  /** Opções de status: { label, value } - value undefined = "Todos" */
  statusOptions: StatusOption[];
  /** Se true, exibe os campos de date range */
  showDateRange?: boolean;
}

function DataFilterInner({
  statusOptions,
  showDateRange = true,
}: DataFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status") ?? undefined;
  const today = new Date().toISOString().slice(0, 10);
  const from = searchParams.get("from") ?? today;
  const to = searchParams.get("to") ?? today;

  const buildUrl = useCallback(
    (updates: { status?: string | undefined; from?: string; to?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("status" in updates) {
        if (updates.status) params.set("status", updates.status);
        else params.delete("status");
      }
      if ("from" in updates) {
        if (updates.from) params.set("from", updates.from);
        else params.delete("from");
      }
      if ("to" in updates) {
        if (updates.to) params.set("to", updates.to);
        else params.delete("to");
      }
      params.delete("page"); // Reset page ao filtrar
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  // Define data atual como padrão (from e to = hoje) quando não há from/to na URL
  useEffect(() => {
    if (!searchParams.has("from") && !searchParams.has("to")) {
      const todayStr = new Date().toISOString().slice(0, 10);
      router.replace(buildUrl({ from: todayStr, to: todayStr }));
    }
  }, [searchParams, buildUrl, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fromVal = (formData.get("from") as string) ?? "";
    const toVal = (formData.get("to") as string) ?? "";
    router.push(buildUrl({ from: fromVal, to: toVal }));
  };

  const hasFilters = status || from || to;
  const clearUrl = pathname;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
      {/* Date range */}
      {showDateRange && (
        <form onSubmit={handleSubmit} className="flex gap-3 items-end flex-wrap">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-from" className="text-xs text-muted-foreground">
              De
            </Label>
            <Input
              key={`from-${from}`}
              id="filter-from"
              name="from"
              type="date"
              defaultValue={from}
              className="w-[140px]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-to" className="text-xs text-muted-foreground">
              Até
            </Label>
            <Input
              key={`to-${to}`}
              id="filter-to"
              name="to"
              type="date"
              defaultValue={to}
              className="w-[140px]"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </Button>
        </form>
      )}

      {/* Status (links) */}
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map(({ label, value }) => (
          <Link
            key={label}
            href={buildUrl({ status: value })}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === value || (!status && !value)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Limpar filtros */}
      {hasFilters && (
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link href={clearUrl}>
            <X className="h-3.5 w-3.5" />
            Limpar
          </Link>
        </Button>
      )}
    </div>
  );
}

export function DataFilter(props: DataFilterProps) {
  return (
    <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-muted" />}>
      <DataFilterInner {...props} />
    </Suspense>
  );
}
