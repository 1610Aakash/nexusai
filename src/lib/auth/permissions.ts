export type OrganizationRole = "admin" | "agent";
export type OrganizationPermission =
  | "organization:read"
  | "organization:update"
  | "members:read"
  | "members:invite"
  | "members:update"
  | "members:remove"
  | "knowledge-base:manage";

const permissions: Record<OrganizationRole, ReadonlySet<OrganizationPermission>> = {
  admin: new Set([
    "organization:read",
    "organization:update",
    "members:read",
    "members:invite",
    "members:update",
    "members:remove",
    "knowledge-base:manage",
  ]),
  agent: new Set(["organization:read"]),
};

export function hasPermission(
  role: OrganizationRole,
  permission: OrganizationPermission,
): boolean {
  return permissions[role].has(permission);
}
