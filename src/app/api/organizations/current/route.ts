import { NextRequest } from "next/server";
import {
  getCurrentOrganization,
  requireAuthenticatedUser,
  requireOrganizationAdmin,
} from "@/lib/auth/session";
import {
  ApiError,
  assertSameOrigin,
  readJson,
  successResponse,
} from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { updateCurrentOrganization } from "@/server/services/organization.service";
import { organizationUpdateSchema } from "@/server/validators/auth.validators";

export const GET = routeHandler(async () => {
  const user = await requireAuthenticatedUser();
  const organization = await getCurrentOrganization(user.id);
  if (!organization) throw new ApiError(404, "No active organization selected");
  return successResponse("Current organization loaded", { organization });
});

export const PATCH = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const { organization } = await requireOrganizationAdmin();
  const input = organizationUpdateSchema.parse(await readJson(request));
  const updated = await updateCurrentOrganization(organization.id, input);
  return successResponse("Organization updated", { organization: updated });
});
