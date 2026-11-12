import { beforeEach, describe, expect, it, vi } from "vitest";

const { connectToDatabase, findOneAndUpdate, query } = vi.hoisted(() => {
  const query = {
    lean: vi.fn(),
    exec: vi.fn(),
  };

  return {
    connectToDatabase: vi.fn(),
    findOneAndUpdate: vi.fn(),
    query,
  };
});

vi.mock("@/lib/mongodb", () => ({ connectToDatabase }));
vi.mock("@/server/models/rate-limit.model", () => ({
  default: { findOneAndUpdate },
}));

import { enforceRateLimit } from "./security.service";

describe("enforceRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    query.lean.mockReturnValue(query);
    query.exec.mockResolvedValue({ count: 1 });
    findOneAndUpdate.mockReturnValue(query);
  });

  it("connects to MongoDB before querying the rate-limit collection", async () => {
    await enforceRateLimit(
      "signup",
      new Request("http://localhost/api/auth/signup"),
      5,
      60_000,
      "user@example.com",
    );

    expect(connectToDatabase).toHaveBeenCalledOnce();
    expect(findOneAndUpdate).toHaveBeenCalledOnce();
    expect(connectToDatabase.mock.invocationCallOrder[0]).toBeLessThan(
      findOneAndUpdate.mock.invocationCallOrder[0],
    );
    expect(findOneAndUpdate.mock.calls[0][2]).toMatchObject({
      upsert: true,
      returnDocument: "after",
      updatePipeline: true,
    });
  });
});
