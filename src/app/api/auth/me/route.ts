import { getCurrentUser } from "@/lib/auth/session";
import { ApiError, successResponse } from "@/server/http/api-response";
import { routeHandler } from "@/server/http/route-handler";

export const GET = routeHandler(async () => {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "Authentication required");
  return successResponse("Current user loaded", { user });
});
