import { NextRequest } from "next/server";
import { requireOrganizationAdmin } from "@/lib/auth/session";
import {
  assertSameOrigin,
  readJson,
  successResponse,
} from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { revokeInvitation } from "@/server/services/organization.service";
import { z } from "zod";

const revokeSchema = z.object({ invitationId: z.string().regex(/^[a-f\d]{24}$/i) });

export const POST = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const { user, organization } = await requireOrganizationAdmin();
  const { invitationId } = revokeSchema.parse(await readJson(request));
  await revokeInvitation(organization.id, user.id, invitationId);
  return successResponse("Invitation revoked", {});
});
