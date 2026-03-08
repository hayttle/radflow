"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Unit } from "@/types/supabase";

const STORAGE_KEY = "radflow_active_unit_id";

interface UnitContextValue {
  activeUnit: Unit | null;
  activeUnitId: string | null;
  units: Unit[];
  setActiveUnit: (unit: Unit | null) => void;
  isLoading: boolean;
}

const UnitContext = createContext<UnitContextValue | null>(null);

interface UnitProviderProps {
  children: ReactNode;
  initialUnits: Unit[];
}

export function UnitProvider({ children, initialUnits }: UnitProviderProps) {
  const [units] = useState<Unit[]>(initialUnits);
  const [activeUnit, setActiveUnitState] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore persisted active unit from localStorage
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      const found = initialUnits.find((u) => u.id === storedId);
      if (found) {
        setActiveUnitState(found);
        setIsLoading(false);
        return;
      }
    }
    // Default to first active unit
    const defaultUnit = initialUnits.find((u) => u.active) ?? initialUnits[0] ?? null;
    setActiveUnitState(defaultUnit);
    setIsLoading(false);
  }, [initialUnits]);

  const setActiveUnit = useCallback((unit: Unit | null) => {
    setActiveUnitState(unit);
    if (unit) {
      localStorage.setItem(STORAGE_KEY, unit.id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <UnitContext.Provider
      value={{
        activeUnit,
        activeUnitId: activeUnit?.id ?? null,
        units,
        setActiveUnit,
        isLoading,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit(): UnitContextValue {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be used inside <UnitProvider>");
  return ctx;
}
