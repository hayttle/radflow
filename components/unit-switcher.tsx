"use client";

import { useUnit } from "@/contexts/unit-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

export function UnitSwitcher() {
  const { activeUnit, units, setActiveUnit } = useUnit();

  if (units.length === 0) return null;

  return (
    <Select
      value={activeUnit?.id ?? ""}
      onValueChange={(id) => {
        const unit = units.find((u) => u.id === id) ?? null;
        setActiveUnit(unit);
      }}
    >
      <SelectTrigger className="h-9 gap-2 border-dashed bg-muted/40 hover:bg-muted/70 transition-colors max-w-[220px]">
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <SelectValue placeholder="Selecione a unidade" />
      </SelectTrigger>
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit.id} value={unit.id}>
            {unit.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
