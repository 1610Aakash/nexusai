import { NextRequest } from "next/server";
import { requireOrganizationAdmin } from "@/lib/auth/session";
import {
  ApiError,
  assertSameOrigin,
  readJson,
  successResponse,
} from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import {
  removeMember,
  updateMember,
} from "@/server/services/organization.service";
import { memberUpdateSchema } from "@/server/validators/auth.validators";

function assertMemberId(memberId: string): void {
  if (!/^[a-f\d]{24}$/i.test(memberId)) throw new ApiError(400, "Invalid member ID");
}

export const PATCH = routeHandler(async (request: NextRequest, context) => {
  assertSameOrigin(request);
  const { user, organization } = await requireOrganizationAdmin();
  const { memberId } = await context.params;
  assertMemberId(memberId);
  const input = memberUpdateSchema.parse(await readJson(request));
  const member = await updateMember(organization.id, user.id, memberId, input);
  return successResponse("Member updated", { member });
});

export const DELETE = routeHandler(async (request: NextRequest, context) => {
  assertSameOrigin(request);
  const { user, organization } = await requireOrganizationAdmin();
  const { memberId } = await context.params;
  assertMemberId(memberId);
  await removeMember(organization.id, user.id, memberId);
  return successResponse("Member removed", {});
});
