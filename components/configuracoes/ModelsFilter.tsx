"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface UnitOption {
  id: string;
  name: string;
}

interface ModelsFilterProps {
  units: UnitOption[];
}

function ModelsFilterInner({ units }: ModelsFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const unit = searchParams.get("unit") ?? "";

  const buildUrl = useCallback(
    (updates: { q?: string; unit?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("q" in updates) {
        if (updates.q) params.set("q", updates.q);
        else params.delete("q");
      }
      if ("unit" in updates) {
        if (updates.unit) params.set("unit", updates.unit);
        else params.delete("unit");
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
    const unitVal = searchParams.get("unit") ?? "";
    router.push(buildUrl({ q: qVal, unit: unitVal }));
  };

  const hasFilters = q || unit;
  const clearUrl = pathname;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-end flex-wrap"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-q" className="text-xs text-muted-foreground">
            Pesquisar por nome
          </Label>
          <Input
            key={`q-${q}`}
            id="filter-q"
            name="q"
            type="search"
            placeholder="Nome do exame"
            defaultValue={q}
            className="w-[200px] sm:w-[220px]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-unit" className="text-xs text-muted-foreground">
            Unidade
          </Label>
          <Select
            value={unit || "all"}
            onValueChange={(v) =>
              router.push(buildUrl({ unit: v === "all" ? "" : v }))
            }
          >
            <SelectTrigger id="filter-unit" className="w-[180px] sm:w-[200px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {units.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export function ModelsFilter(props: ModelsFilterProps) {
  return (
    <Suspense
      fallback={
        <div className="h-10 animate-pulse rounded-md bg-muted" />
      }
    >
      <ModelsFilterInner {...props} />
    </Suspense>
  );
}
