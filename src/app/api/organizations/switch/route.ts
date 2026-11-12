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
import { switchOrganization } from "@/server/services/organization.service";
import { organizationSwitchSchema } from "@/server/validators/auth.validators";

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const user = await requireAuthenticatedUser();
  const input = organizationSwitchSchema.parse(await readJson(request));
  const organization = await switchOrganization(user.id, input.organizationId);
  const response = successResponse("Organization switched", { organization });
  response.cookies.set(
    ACTIVE_ORGANIZATION_COOKIE,
    organization.id,
    organizationCookieOptions(),
  );
  return response;
});
