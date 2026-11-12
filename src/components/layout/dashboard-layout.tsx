"use client";

import { useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { SafeUser, OrganizationContext } from "@/lib/auth/session";
import type { OrganizationListItem } from "@/server/services/organization.service";

export function DashboardLayout({
  children,
  user,
  organization,
  organizations,
}: {
  children: React.ReactNode;
  user: SafeUser;
  organization: OrganizationContext;
  organizations: OrganizationListItem[];
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar user={user} organization={organization} organizations={organizations} collapsed={collapsed} className="fixed inset-y-0 left-0 z-20 hidden lg:flex" />
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-none">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar
            user={user}
            organization={organization}
            organizations={organizations}
            onNavigate={() => setMobileOpen(false)}
            className="h-full w-full border-r-0"
          />
        </SheetContent>
      </Sheet>
      <div className={`min-h-screen min-w-0 transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"}`}>
        <DashboardHeader
          user={user}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
