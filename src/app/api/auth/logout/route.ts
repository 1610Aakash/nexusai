import { NextRequest } from "next/server";
import { ACTIVE_ORGANIZATION_COOKIE, SESSION_COOKIE } from "@/lib/auth/session";
import { organizationCookieOptions, sessionCookieOptions } from "@/lib/auth/jwt";
import { assertSameOrigin, successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const response = successResponse("Signed out successfully", {});
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  response.cookies.set(ACTIVE_ORGANIZATION_COOKIE, "", {
    ...organizationCookieOptions(),
    maxAge: 0,
  });
  return response;
});
