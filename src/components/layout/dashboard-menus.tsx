"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { requestApi } from "@/features/auth/model/auth-api.model";
import type { SafeUser, OrganizationContext } from "@/lib/auth/session";
import type { OrganizationListItem } from "@/server/services/organization.service";
import { SwitchOrganizationView } from "@/features/organizations/switch-organization/view/switch-organization.view";

export function OrganizationSwitcher({
  current,
  organizations,
  collapsed = false,
}: {
  current: OrganizationContext;
  organizations: OrganizationListItem[];
  collapsed?: boolean;
}) {
  return <SwitchOrganizationView current={current} organizations={organizations} collapsed={collapsed} />;
}

export function AccountMenu({
  user,
  collapsed = false,
  dropUp = true,
}: {
  user: SafeUser;
  collapsed?: boolean;
  dropUp?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const signOut = async () => {
    setError("");
    try {
      await requestApi("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign out");
    }
  };

  return (
    <div className="relative">
      <details className="group">
        <summary
          title={user.name}
          className={`flex w-full cursor-pointer list-none items-center rounded-xl p-2 text-left transition-colors hover:bg-slate-50 ${collapsed ? "justify-center" : "gap-3"}`}
        >
          <Avatar>
            <AvatarFallback className="bg-amber-100 text-xs font-semibold text-amber-800">{initials || "U"}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-900">{user.name}</span>
                <span className="block truncate text-[11px] text-slate-500">{user.email}</span>
              </span>
              <ChevronDown className="size-4 text-slate-400" aria-hidden="true" />
            </>
          )}
        </summary>
        <div className={`absolute ${dropUp ? "bottom-12 left-1" : "right-0 top-12"} z-40 w-[230px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl`}>
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="truncate text-xs font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-[11px] text-slate-500">{user.email}</p>
          </div>
          <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
            <UserRound className="size-4 text-slate-400" /> Profile
          </Link>
          <Link href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
            <Settings2 className="size-4 text-slate-400" /> Settings
          </Link>
          <Button variant="ghost" className="h-9 w-full justify-start gap-2 px-3 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => void signOut()}>
            <LogOut className="size-4" /> Sign out
          </Button>
          {error && <p role="alert" className="px-3 py-1 text-xs text-red-600">{error}</p>}
        </div>
      </details>
    </div>
  );
}
