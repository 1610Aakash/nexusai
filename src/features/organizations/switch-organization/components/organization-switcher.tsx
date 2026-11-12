"use client";

import { Building2, ChevronDown } from "lucide-react";
import type { OrganizationContext } from "@/lib/auth/session";
import type { OrganizationListItem } from "@/server/services/organization.service";
import { useOrganizationSwitcherViewModel } from "../viewmodel/useOrganizationSwitcherViewModel";

export function OrganizationSwitcher({
  current,
  organizations,
  collapsed = false,
}: {
  current: OrganizationContext;
  organizations: OrganizationListItem[];
  collapsed?: boolean;
}) {
  const { switchTo, error } = useOrganizationSwitcherViewModel(current.id);

  return (
    <div className={`mx-3 mt-4 ${collapsed ? "flex justify-center" : ""}`}>
      {collapsed ? (
        <span title={current.name} className="flex size-10 items-center justify-center rounded-lg bg-violet-100 text-xs font-semibold text-violet-700">
          {current.name.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <>
          <label className="sr-only" htmlFor="active-organization">Current workspace</label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-violet-700" aria-hidden="true" />
            <select
              id="active-organization"
              value={current.id}
              onChange={(event) => void switchTo(event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-9 text-left text-xs font-semibold text-slate-900 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name} · {organization.role}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          </div>
          <p className="mt-1 truncate px-1 text-[10px] text-slate-400">{current.slug}.nexusai.app</p>
        </>
      )}
      {error && !collapsed && <p role="alert" className="mt-2 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
