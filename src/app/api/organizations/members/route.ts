import { requireOrganizationAdmin } from "@/lib/auth/session";
import { successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { listMembers } from "@/server/services/organization.service";

export const GET = routeHandler(async () => {
  const { organization } = await requireOrganizationAdmin();
  return successResponse("Organization members loaded", {
    members: await listMembers(organization.id),
  });
});
