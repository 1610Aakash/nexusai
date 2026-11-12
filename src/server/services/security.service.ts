import { createHash, randomBytes } from "node:crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { ApiError } from "@/server/http/api-response";
import RateLimit from "@/server/models/rate-limit.model";

export function createOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function enforceRateLimit(
  scope: string,
  request: Request,
  limit: number,
  windowMs: number,
  identity = "",
): Promise<void> {
  await connectToDatabase();

  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const key = hashOpaqueToken(`${scope}:${ip}:${identity.toLowerCase()}`);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const activeWindow = { $gt: ["$expiresAt", now] };

  const counter = await RateLimit.findOneAndUpdate(
    { _id: key },
    [
      {
        $set: {
          count: {
            $cond: [
              activeWindow,
              { $add: [{ $ifNull: ["$count", 0] }, 1] },
              1,
            ],
          },
          expiresAt: { $cond: [activeWindow, "$expiresAt", expiresAt] },
        },
      },
    ],
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: false,
      updatePipeline: true,
    },
  )
    .lean()
    .exec();

  if (counter && counter.count > limit) {
    throw new ApiError(429, "Too many attempts. Please try again later.");
  }
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
