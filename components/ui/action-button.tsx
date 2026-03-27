"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  tooltip: string;
  variant?: "ghost" | "outline" | "destructive";
}

const variantClass: Record<NonNullable<ActionButtonProps["variant"]>, string> = {
  ghost: "text-muted-foreground hover:text-foreground",
  outline: "border border-input text-muted-foreground hover:text-foreground",
  destructive:
    "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
};

export function ActionButton({
  icon: Icon,
  tooltip,
  variant = "ghost",
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", variantClass[variant], className)}
          {...props}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
