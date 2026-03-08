import { createContext, useContext } from "react";
import type { TemplateVariable } from "@/types/supabase";

interface VariableContextType {
  variables: TemplateVariable[];
  selections: Record<string, string>;
  onSelect: (name: string, value: string) => void;
}

export const VariableContext = createContext<VariableContextType | null>(null);

export const useVariableContext = () => {
  const context = useContext(VariableContext);
  if (!context) {
    throw new Error("useVariableContext must be used within a VariableProvider");
  }
  return context;
};
