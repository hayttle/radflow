"use client";

import { useUnit } from "@/contexts/unit-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useState } from "react";
import type { Unit } from "@/types/supabase";

export function UnitSwitcher() {
  const { activeUnit, units, setActiveUnit } = useUnit();
  const [pendingUnit, setPendingUnit] = useState<Unit | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (units.length === 0) return null;

  const handleValueChange = (id: string) => {
    const unit = units.find((u) => u.id === id) ?? null;
    if (unit && unit.id !== activeUnit?.id) {
      setPendingUnit(unit);
      setIsConfirmOpen(true);
    }
  };

  const handleConfirm = () => {
    if (pendingUnit) {
      setActiveUnit(pendingUnit);
    }
    setIsConfirmOpen(false);
    setPendingUnit(null);
  };

  return (
    <>
      <Select
        value={activeUnit?.id ?? ""}
        onValueChange={handleValueChange}
      >
      <SelectTrigger className="h-9 gap-2 border-dashed bg-muted/40 hover:bg-muted/70 transition-colors max-w-[220px]">
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <SelectValue placeholder="Selecione a unidade" />
      </SelectTrigger>
      <SelectContent position="popper">
        {units.map((unit) => (
          <SelectItem key={unit.id} value={unit.id}>
            {unit.name}
          </SelectItem>
        ))}
      </SelectContent>
      </Select>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trocar Unidade de Trabalho</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja mudar para a unidade{" "}
              <span className="font-semibold text-foreground">
                "{pendingUnit?.name}"
              </span>
              ? Isso pode afetar os dados e modelos disponíveis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
