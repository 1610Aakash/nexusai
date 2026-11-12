import { NextRequest } from "next/server";
import { assertSameOrigin, readJson, successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { resetPasswordSchema } from "@/server/validators/auth.validators";
import { resetPassword } from "@/server/services/auth.service";
import { enforceRateLimit } from "@/server/services/security.service";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const input = resetPasswordSchema.parse(await readJson(request));
  await enforceRateLimit("reset-password", request, 10, 60 * 60 * 1000);
  await resetPassword(input.token, input.password);
  return successResponse("Password updated. Please sign in again.", {});
});
