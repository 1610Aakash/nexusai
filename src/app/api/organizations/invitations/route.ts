import { NextRequest } from "next/server";
import { requireOrganizationAdmin } from "@/lib/auth/session";
import {
  assertSameOrigin,
  readJson,
  successResponse,
} from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import {
  createInvitation,
  listInvitations,
} from "@/server/services/organization.service";
import { inviteSchema } from "@/server/validators/auth.validators";
import { enforceRateLimit } from "@/server/services/security.service";

export const GET = routeHandler(async () => {
  const { organization } = await requireOrganizationAdmin();
  return successResponse("Pending invitations loaded", {
    invitations: await listInvitations(organization.id),
  });
});

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const { user, organization } = await requireOrganizationAdmin();
  const input = inviteSchema.parse(await readJson(request));
  await enforceRateLimit("organization-invitation", request, 20, 60 * 60 * 1000, organization.id);
  const invitation = await createInvitation(organization.id, user.id, input);
  return successResponse("Invitation sent", { invitation }, 201);
});
