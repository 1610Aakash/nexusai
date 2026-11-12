import { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { sessionCookieOptions } from "@/lib/auth/jwt";
import { loginSchema } from "@/server/validators/auth.validators";
import { assertSameOrigin, readJson, successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { login } from "@/server/services/auth.service";
import { enforceRateLimit } from "@/server/services/security.service";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const input = loginSchema.parse(await readJson(request));
  await enforceRateLimit("login", request, 8, 15 * 60 * 1000, input.email);
  const result = await login(input);
  const response = successResponse("Signed in successfully", { user: result.user });
  response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  return response;
});
