"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SafeUser } from "@/lib/auth/session";
import { AccountMenu } from "./dashboard-menus";

const routeTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/tickets": "Tickets",
  "/inbox": "Inbox",
  "/customers": "Customers",
  "/knowledge-base": "Knowledge Base",
  "/ai-agents": "AI Agents",
  "/team": "Team",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

type DashboardHeaderProps = {
  user: SafeUser;
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
};

export function DashboardHeader({
  user,
  collapsed,
  onToggleSidebar,
  onOpenMobileNav,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const title = routeTitles[pathname] ?? "Workspace";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open dashboard navigation"
        >
          <Menu />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
          <span>Workspace</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </div>
        <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden w-52 lg:block xl:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            aria-label="Search workspace"
            placeholder="Search workspace..."
            className="h-9 border-slate-200 bg-slate-50 pl-9 text-xs shadow-none"
          />
          <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 xl:block">
            ⌘ K
          </kbd>
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-600 ring-2 ring-white" />
        </Button>
        <div className="sm:hidden"><AccountMenu user={user} collapsed dropUp={false} /></div>
      </div>
    </header>
  );
}
