"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()} 
      className="shadow-lg rounded-full px-6 gap-2"
    >
      <Printer className="h-4 w-4" />
      Imprimir Laudo
    </Button>
  );
}
