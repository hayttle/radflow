"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center px-6 border-b shrink-0 flex-row bg-sidebar">
        <div className="flex items-center justify-center p-2 rounded-xl bg-primary text-primary-foreground shadow-sm">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl tracking-tight ml-3">Boilerplate</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard" || pathname.startsWith("/dashboard/")}
                  className="py-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] data-[active=true]:bg-primary/5 data-[active=true]:text-primary"
                >
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="text-base font-medium ml-3">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/design-system"}
                  className="py-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] data-[active=true]:bg-primary/5 data-[active=true]:text-primary"
                >
                  <Link href="/design-system" className="flex items-center">
                    <Palette className="h-5 w-5" />
                    <span className="text-base font-medium ml-3">Design System</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
