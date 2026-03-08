"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div className={`container mx-auto max-w-7xl py-10 px-4 md:px-6 pb-24 ${className || ""}`} {...props}>
      {(title || description || actions) && (
        <div className="space-y-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              {title && <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{title}</h1>}
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
      )}
      <div>{children}</div>
    </div>
  );
}
