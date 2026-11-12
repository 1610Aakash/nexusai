"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  LayoutDashboard,
  Settings,
  Sparkles,
  UsersRound,
  ChartNoAxesCombined,
  Inbox,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { DASHBOARD_NAVIGATION } from "@/lib/constants";
import { hasPermission } from "@/lib/auth/permissions";
import type { SafeUser, OrganizationContext } from "@/lib/auth/session";
import type { OrganizationListItem } from "@/server/services/organization.service";
import { AccountMenu, OrganizationSwitcher } from "./dashboard-menus";
import { cn } from "@/lib/utils";

const navigationIcons: Record<(typeof DASHBOARD_NAVIGATION)[number]["icon"], LucideIcon> = {
  layout: LayoutDashboard,
  ticket: Ticket,
  inbox: Inbox,
  users: UsersRound,
  book: BookOpen,
  sparkles: Bot,
  team: UsersRound,
  chart: ChartNoAxesCombined,
  settings: Settings,
};

type DashboardSidebarProps = {
  user: SafeUser;
  organization: OrganizationContext;
  organizations: OrganizationListItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function DashboardSidebar({
  user,
  organization,
  organizations,
  collapsed = false,
  onNavigate,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-[264px]",
        className,
      )}
    >
      <div className={cn("flex h-[72px] items-center border-b border-slate-100", collapsed ? "justify-center px-2" : "px-5")}>
        {collapsed ? (
          <Link href="/" aria-label="NexusAI home" className="flex size-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Sparkles className="size-5" aria-hidden="true" />
          </Link>
        ) : (
          <BrandMark />
        )}
      </div>

      <OrganizationSwitcher current={organization} organizations={organizations} collapsed={collapsed} />

      <div className="px-5 pb-2 pt-6">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Workspace
          </p>
        )}
      </div>
      <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 overflow-y-auto px-3">
        {DASHBOARD_NAVIGATION.map((item) => {
          if (
            item.href === "/team" &&
            !hasPermission(organization.role, "members:read")
          ) {
            return null;
          }
          const Icon = navigationIcons[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-10 items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                isActive
                  ? "bg-violet-50 text-violet-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              <Icon className={cn("size-[18px] shrink-0", isActive ? "text-violet-700" : "text-slate-400")} aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <AccountMenu user={user} collapsed={collapsed} />
      </div>
    </aside>
  );
}
