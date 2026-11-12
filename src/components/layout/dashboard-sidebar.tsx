"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  Settings,
  Sparkles,
  UsersRound,
  ChartNoAxesCombined,
  Inbox,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { DASHBOARD_NAVIGATION } from "@/lib/constants";
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
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function DashboardSidebar({
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

      <button
        type="button"
        title="Select workspace"
        className={cn(
          "mx-3 mt-4 flex items-center rounded-xl border border-slate-200 bg-white text-left transition-colors hover:bg-slate-50",
          collapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-semibold text-violet-700">
          AC
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-slate-900">Acme Support</span>
              <span className="mt-0.5 block text-[11px] text-slate-500">Sample workspace</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
          </>
        )}
      </button>

      <div className="px-5 pb-2 pt-6">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Workspace
          </p>
        )}
      </div>
      <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 overflow-y-auto px-3">
        {DASHBOARD_NAVIGATION.map((item) => {
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
        <button
          type="button"
          title="Account menu"
          className={cn(
            "flex w-full items-center rounded-xl p-2 text-left transition-colors hover:bg-slate-50",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          <Avatar>
            <AvatarFallback className="bg-amber-100 text-xs font-semibold text-amber-800">JD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-900">Jordan Davis</span>
                <span className="block truncate text-[11px] text-slate-500">Workspace admin</span>
              </span>
              <ChevronDown className="size-4 text-slate-400" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
