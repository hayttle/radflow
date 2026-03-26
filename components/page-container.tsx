"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  fullWidth,
  className,
  ...props
}: PageContainerProps) {
  const baseClasses = fullWidth
    ? "w-full max-w-none p-0"
    : "w-full h-full p-4 md:p-6 lg:p-8 pb-24";
  return (
    <div className={`${baseClasses} ${className || ""}`} {...props}>
      {(title || description || actions) && (
        <div className="space-y-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              {title && <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>}
              {description && (
                <p className="text-muted-foreground text-md max-w-3xl leading-relaxed">
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
