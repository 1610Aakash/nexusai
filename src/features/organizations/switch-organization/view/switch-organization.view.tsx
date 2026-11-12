import type { OrganizationContext } from "@/lib/auth/session";
import type { OrganizationListItem } from "@/server/services/organization.service";
import { OrganizationSwitcher } from "../components/organization-switcher";

export function SwitchOrganizationView({
  current,
  organizations,
  collapsed,
}: {
  current: OrganizationContext;
  organizations: OrganizationListItem[];
  collapsed?: boolean;
}) {
  return (
    <OrganizationSwitcher
      current={current}
      organizations={organizations}
      collapsed={collapsed}
    />
  );
}
