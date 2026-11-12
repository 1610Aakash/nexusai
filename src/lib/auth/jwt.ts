import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const JWT_ISSUER = "nexusai";
const JWT_AUDIENCE = "nexusai-web";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 bytes");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = JWTPayload & { ver: number };

export async function signSession(userId: string, tokenVersion: number): Promise<string> {
  return new SignJWT({ ver: tokenVersion })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithms: ["HS256"],
    maxTokenAge: `${SESSION_TTL_SECONDS}s`,
  });

  if (
    typeof payload.sub !== "string" ||
    !/^[a-f\d]{24}$/i.test(payload.sub) ||
    typeof payload.ver !== "number" ||
    !Number.isInteger(payload.ver)
  ) {
    throw new Error("Invalid session claims");
  }

  return payload as SessionPayload;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function organizationCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export { SESSION_TTL_SECONDS };
