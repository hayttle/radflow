"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface PhrasesFilterProps {
  categories: string[];
}

function PhrasesFilterInner({ categories }: PhrasesFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") ?? "";

  const buildUrl = useCallback(
    (updates: { category?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("category" in updates) {
        if (updates.category) params.set("category", updates.category);
        else params.delete("category");
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  const hasFilters = !!category;
  const clearUrl = pathname;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-category" className="text-xs text-muted-foreground">
            Categoria
          </Label>
          <Select
            value={category || "all"}
            onValueChange={(v) =>
              router.push(buildUrl({ category: v === "all" ? "" : v }))
            }
          >
            <SelectTrigger id="filter-category" className="w-[180px] sm:w-[200px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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

export function PhrasesFilter(props: PhrasesFilterProps) {
  return (
    <Suspense
      fallback={
        <div className="h-10 animate-pulse rounded-md bg-muted" />
      }
    >
      <PhrasesFilterInner {...props} />
    </Suspense>
  );
}
