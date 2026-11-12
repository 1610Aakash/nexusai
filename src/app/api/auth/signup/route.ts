import { NextRequest } from "next/server";
import { signupSchema } from "@/server/validators/auth.validators";
import { assertSameOrigin, readJson, successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { signup } from "@/server/services/auth.service";
import { enforceRateLimit } from "@/server/services/security.service";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { sessionCookieOptions } from "@/lib/auth/jwt";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const input = signupSchema.parse(await readJson(request));
  await enforceRateLimit("signup", request, 5, 60 * 60 * 1000, input.email);
  const result = await signup(input);
  const message =
    result.emailDelivery === "disabled"
      ? "Account created successfully."
      : result.emailDelivery === "smtp"
        ? "Account created. Check your email to verify your address."
        : result.emailDelivery === "development-preview"
          ? "Account created. A development-only verification link was written to the server log."
          : "Account created, but the verification message could not be delivered. Please request a new email.";
  const response = successResponse(
    message,
    { user: result.user, emailDelivery: result.emailDelivery },
    201,
  );
  response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  return response;
});
