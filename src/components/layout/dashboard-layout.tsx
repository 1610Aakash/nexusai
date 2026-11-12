"use client";

import { useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar collapsed={collapsed} className="fixed inset-y-0 left-0 z-20 hidden lg:flex" />
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-none">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar
            onNavigate={() => setMobileOpen(false)}
            className="h-full w-full border-r-0"
          />
        </SheetContent>
      </Sheet>
      <div className={`min-h-screen min-w-0 transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"}`}>
        <DashboardHeader
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
