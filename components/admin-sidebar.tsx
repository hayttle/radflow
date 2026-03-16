"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserProfile } from "@/components/user-profile";
import {
  Users,
  MessageSquare,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Package,
} from "lucide-react";

const adminNav = [
  {
    label: "Painel Geral",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Usuários",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    label: "Feedbacks/Suporte",
    href: "/admin/feedbacks",
    icon: MessageSquare,
  },
  {
    label: "Planos",
    href: "/admin/planos",
    icon: Package,
  },
  {
    label: "Assinaturas",
    href: "/admin/assinaturas",
    icon: CreditCard,
  },
];

interface AdminSidebarProps {
  userEmail?: string;
  userName?: string;
  avatarUrl?: string;
}

export function AdminSidebar({ userEmail, userName, avatarUrl }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar variant="inset" className="bg-background/95 backdrop-blur-md border-r">
      <SidebarHeader className="flex h-16 items-center px-4 border-b shrink-0 flex-row bg-sidebar">
        <div className="flex items-center justify-center p-2 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col ml-3">
          <span className="font-bold text-lg tracking-tight leading-none text-foreground">Admin RAD</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Super Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
            Administração
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {adminNav.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    className="py-6 transition-all duration-300 data-[active=true]:bg-orange-600/10 data-[active=true]:text-orange-600 hover:bg-orange-600/5 group"
                  >
                    <Link href={href} className="flex items-center">
                      <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span className="text-base font-medium ml-3">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 my-2 opacity-50" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="py-6 transition-all duration-300 hover:bg-primary/5 text-muted-foreground hover:text-primary group"
                >
                  <Link href="/dashboard" className="flex items-center">
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span className="text-base font-medium ml-3">Voltar ao App</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="min-w-0 flex-1">
            <UserProfile
              variant="sidebar"
              userEmail={userEmail}
              userName={userName}
              avatarUrl={avatarUrl}
            />
          </div>
          <ThemeSwitcher />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
