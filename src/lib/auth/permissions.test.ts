import { describe, expect, it } from "vitest";
import { hasPermission } from "./permissions";

describe("organization membership permissions", () => {
  it("grants organization administration only to admins", () => {
    expect(hasPermission("admin", "members:invite")).toBe(true);
    expect(hasPermission("admin", "organization:update")).toBe(true);
    expect(hasPermission("agent", "members:invite")).toBe(false);
    expect(hasPermission("agent", "members:remove")).toBe(false);
  });

  it("allows agents to read general organization context without team management", () => {
    expect(hasPermission("agent", "organization:read")).toBe(true);
    expect(hasPermission("agent", "members:read")).toBe(false);
  });
});
