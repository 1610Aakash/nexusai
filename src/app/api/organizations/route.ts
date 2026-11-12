import { NextRequest } from "next/server";
import { ACTIVE_ORGANIZATION_COOKIE, requireAuthenticatedUser } from "@/lib/auth/session";
import { organizationCookieOptions } from "@/lib/auth/jwt";
import {
  assertSameOrigin,
  readJson,
  successResponse,
} from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { createOrganization, listOrganizations } from "@/server/services/organization.service";
import { organizationCreateSchema } from "@/server/validators/auth.validators";

export const GET = routeHandler(async () => {
  const user = await requireAuthenticatedUser();
  return successResponse("Organizations loaded", {
    organizations: await listOrganizations(user.id),
  });
});

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const user = await requireAuthenticatedUser();
  const input = organizationCreateSchema.parse(await readJson(request));
  const organization = await createOrganization(user.id, input);
  const response = successResponse(
    "Organization created",
    {
      organization: {
        id: organization._id.toString(),
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        role: "admin",
      },
    },
    201,
  );
  response.cookies.set(
    ACTIVE_ORGANIZATION_COOKIE,
    organization._id.toString(),
    organizationCookieOptions(),
  );
  return response;
});
