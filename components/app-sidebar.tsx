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
  FileText,
  Users,
  Building2,
  Scan,
  MessageSquareQuote,
  Signature,
  Activity,
  LayoutDashboard,
} from "lucide-react";

const mainNav = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Laudos",
    href: "/laudos",
    icon: FileText,
  },
  {
    label: "Pacientes",
    href: "/pacientes",
    icon: Users,
  },
];

const configNav = [
  {
    label: "Unidades",
    href: "/configuracoes/unidades",
    icon: Building2,
  },
  {
    label: "Modelos de Exame",
    href: "/configuracoes/modelos",
    icon: Scan,
  },
  {
    label: "Assinatura",
    href: "/configuracoes/assinatura",
    icon: Signature,
  },
  {
    label: "Frases Padrão",
    href: "/configuracoes/frases",
    icon: MessageSquareQuote,
  },
];

interface AppSidebarProps {
  userEmail?: string;
  userName?: string;
  avatarUrl?: string;
}

export function AppSidebar({ userEmail, userName, avatarUrl }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center px-4 border-b shrink-0 flex-row bg-sidebar">
        <div className="flex items-center justify-center p-2 rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Activity className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl tracking-tight ml-3">RadFlow</span>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 pt-2">
              {mainNav.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    className="py-5 transition-all duration-200 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={href} className="flex items-center">
                      <Icon className="h-5 w-5" />
                      <span className="text-base font-medium ml-3">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {configNav.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    className="py-4 transition-all duration-200 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={href} className="flex items-center">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium ml-3">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 px-2 py-1.5">
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
