import { describe, expect, it } from "vitest";
import {
  loginSchema,
  organizationCreateSchema,
  passwordSchema,
  profileUpdateSchema,
  signupSchema,
} from "./auth.validators";

describe("authentication input validation", () => {
  it("normalizes email addresses before account lookup", () => {
    expect(
      signupSchema.parse({
        name: "Jordan Davis",
        email: "  Jordan@Example.COM ",
        password: "StrongPassword123",
      }).email,
    ).toBe("jordan@example.com");
  });

  it("accepts the documented strong-password shape", () => {
    expect(passwordSchema.safeParse("StrongPassword123").success).toBe(true);
    expect(passwordSchema.safeParse("weakpassword").success).toBe(false);
  });

  it("does not allow profile updates to write sensitive fields", () => {
    expect(profileUpdateSchema.safeParse({ name: "Jordan Davis" }).success).toBe(true);
    expect(
      profileUpdateSchema.safeParse({ role: "admin", isEmailVerified: true }).success,
    ).toBe(false);
  });

  it("rejects malformed login and organization data", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
    expect(
      organizationCreateSchema.safeParse({
        name: "Acme Support",
        slug: "Acme Support",
        description: "",
      }).success,
    ).toBe(false);
  });
});
