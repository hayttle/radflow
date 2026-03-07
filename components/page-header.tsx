"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  if (!title) return null;

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
      <Separator className="bg-primary/10" />
    </div>
  );
}
