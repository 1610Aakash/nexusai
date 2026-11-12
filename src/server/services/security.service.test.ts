import { describe, expect, it } from "vitest";
import {
  addDays,
  addHours,
  createOpaqueToken,
  hashOpaqueToken,
} from "./security.service";

describe("security token utilities", () => {
  it("creates unguessable-looking tokens and stores a one-way digest", () => {
    const token = createOpaqueToken();
    expect(token).toHaveLength(43);
    expect(hashOpaqueToken(token)).toMatch(/^[a-f\d]{64}$/);
    expect(hashOpaqueToken(token)).not.toBe(token);
    expect(hashOpaqueToken(token)).toBe(hashOpaqueToken(token));
  });

  it("calculates token expiration windows", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    expect(addHours(start, 1).toISOString()).toBe("2026-01-01T01:00:00.000Z");
    expect(addDays(start, 7).toISOString()).toBe("2026-01-08T00:00:00.000Z");
  });
});
