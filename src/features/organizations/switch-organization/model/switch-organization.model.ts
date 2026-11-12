import { requestApi } from "@/features/auth/model/auth-api.model";

export async function switchOrganizationRequest(organizationId: string) {
  return requestApi<{ organization: { id: string; name: string; slug: string; role: string } }>(
    "/api/organizations/switch",
    { body: { organizationId } },
  );
}
