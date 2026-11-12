import { z } from "zod";
import { requestApi } from "@/features/auth/model/auth-api.model";

export async function acceptInvitationRequest(token: string) {
  const parsedToken = z.string().min(32).max(256).parse(token);
  return requestApi<{ organizationId: string }>("/api/organizations/invitations/accept", {
    body: { token: parsedToken },
  });
}
