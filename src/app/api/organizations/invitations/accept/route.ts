import { NextRequest } from "next/server";
import {
  ACTIVE_ORGANIZATION_COOKIE,
  requireAuthenticatedUser,
} from "@/lib/auth/session";
import { organizationCookieOptions } from "@/lib/auth/jwt";
import {
  assertSameOrigin,
  readJson,
  successResponse,
} from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { acceptInvitation } from "@/server/services/organization.service";
import { acceptInvitationSchema } from "@/server/validators/auth.validators";
import { enforceRateLimit } from "@/server/services/security.service";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const user = await requireAuthenticatedUser();
  const input = acceptInvitationSchema.parse(await readJson(request));
  await enforceRateLimit("accept-invitation", request, 10, 60 * 60 * 1000);
  const organizationId = await acceptInvitation(user.id, user.email, input.token);
  const response = successResponse("Invitation accepted", { organizationId });
  response.cookies.set(
    ACTIVE_ORGANIZATION_COOKIE,
    organizationId,
    organizationCookieOptions(),
  );
  return response;
});
