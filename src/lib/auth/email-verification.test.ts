import { afterEach, describe, expect, it, vi } from "vitest";
import { isEmailVerificationRequired } from "./email-verification";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("email verification policy", () => {
  it("is disabled when configured for local signup without email delivery", () => {
    vi.stubEnv("REQUIRE_EMAIL_VERIFICATION", "false");
    expect(isEmailVerificationRequired()).toBe(false);
  });

  it("remains enabled unless explicitly disabled", () => {
    vi.stubEnv("REQUIRE_EMAIL_VERIFICATION", "true");
    expect(isEmailVerificationRequired()).toBe(true);

    vi.stubEnv("REQUIRE_EMAIL_VERIFICATION", "");
    expect(isEmailVerificationRequired()).toBe(true);
  });
});
