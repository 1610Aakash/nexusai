import { NextRequest } from "next/server";
import { assertSameOrigin, readJson, successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { emailOnlySchema } from "@/server/validators/auth.validators";
import { requestPasswordReset } from "@/server/services/auth.service";
import { enforceRateLimit } from "@/server/services/security.service";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const input = emailOnlySchema.parse(await readJson(request));
  await enforceRateLimit("forgot-password", request, 5, 60 * 60 * 1000, input.email);
  await requestPasswordReset(input.email);
  return successResponse(
    "If an account exists for that email, password reset instructions will be sent.",
    {},
  );
});
