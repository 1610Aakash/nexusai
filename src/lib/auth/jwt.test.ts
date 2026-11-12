import { afterEach, describe, expect, it } from "vitest";
import { SignJWT } from "jose";
import { signSession, verifySession } from "./jwt";

const originalSecret = process.env.JWT_SECRET;
const testSecret = "test-only-secret-with-at-least-thirty-two-bytes";

afterEach(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

describe("JWT sessions", () => {
  it("signs a minimal session and validates its issuer, audience, and version", async () => {
    process.env.JWT_SECRET = testSecret;
    const userId = "507f1f77bcf86cd799439011";
    const token = await signSession(userId, 3);
    const claims = await verifySession(token);
    expect(claims.sub).toBe(userId);
    expect(claims.ver).toBe(3);
    expect(claims.org).toBeUndefined();
  });

  it("rejects a JWT whose signature is invalid", async () => {
    process.env.JWT_SECRET = testSecret;
    const token = await signSession("507f1f77bcf86cd799439011", 0);
    process.env.JWT_SECRET = `${testSecret}-changed`;
    await expect(verifySession(token)).rejects.toThrow();
  });

  it("rejects an expired session", async () => {
    process.env.JWT_SECRET = testSecret;
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ ver: 0 })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("507f1f77bcf86cd799439011")
      .setIssuer("nexusai")
      .setAudience("nexusai-web")
      .setExpirationTime("1 second ago")
      .sign(secret);
    await expect(verifySession(token)).rejects.toThrow();
  });

  it("requires a sufficiently strong session secret", async () => {
    process.env.JWT_SECRET = "too-short";
    await expect(signSession("507f1f77bcf86cd799439011", 0)).rejects.toThrow(
      "JWT_SECRET must be configured",
    );
  });
});
