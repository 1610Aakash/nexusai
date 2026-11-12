import { NextRequest } from "next/server";
import { assertSameOrigin, readJson, successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { verifyEmailSchema } from "@/server/validators/auth.validators";
import { verifyEmail } from "@/server/services/auth.service";
import { enforceRateLimit } from "@/server/services/security.service";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const input = verifyEmailSchema.parse(await readJson(request));
  await enforceRateLimit("verify-email", request, 10, 60 * 60 * 1000);
  await verifyEmail(input.token);
  return successResponse("Email verified. You can now sign in.", {});
});
