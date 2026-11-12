import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  ApiError,
  assertSameOrigin,
  readJson,
  successResponse,
} from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";
import { updateProfile } from "@/server/services/auth.service";
import { profileUpdateSchema } from "@/server/validators/auth.validators";

export const GET = routeHandler(async () => {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "Authentication required");
  return successResponse("Profile loaded", { user });
});

export const PATCH = routeHandler(async (request: NextRequest) => {
  assertSameOrigin(request);
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "Authentication required");
  const input = profileUpdateSchema.parse(await readJson(request));
  const updatedUser = await updateProfile(user.id, input);
  return successResponse("Profile updated", { user: updatedUser });
});
