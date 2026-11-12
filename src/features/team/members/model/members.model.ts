import { z } from "zod";
import { requestApi } from "@/features/auth/model/auth-api.model";

export type TeamMember = {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "agent";
  status: "active" | "suspended";
  joinedAt: string;
};

export type TeamInvitation = {
  id: string;
  email: string;
  role: "admin" | "agent";
  status: "pending";
  expiresAt: string;
  createdAt: string;
};

export const invitationFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
  role: z.enum(["admin", "agent"]),
});

export type InvitationFormValues = z.infer<typeof invitationFormSchema>;

export async function fetchTeam() {
  const [members, invitations] = await Promise.all([
    requestApi<{ members: TeamMember[] }>("/api/organizations/members"),
    requestApi<{ invitations: TeamInvitation[] }>("/api/organizations/invitations"),
  ]);
  return { members: members.data.members, invitations: invitations.data.invitations };
}

export async function inviteMember(values: InvitationFormValues) {
  return requestApi<{ invitation: TeamInvitation }>("/api/organizations/invitations", {
    body: values,
  });
}

export async function revokeInvitation(invitationId: string) {
  return requestApi("/api/organizations/invitations/revoke", {
    body: { invitationId },
  });
}

export async function updateMember(
  memberId: string,
  patch: { role?: TeamMember["role"]; status?: TeamMember["status"] },
) {
  return requestApi<{ member: Pick<TeamMember, "id" | "role" | "status"> }>(
    `/api/organizations/members/${encodeURIComponent(memberId)}`,
    { method: "PATCH", body: patch },
  );
}

export async function removeMember(memberId: string) {
  return requestApi(`/api/organizations/members/${encodeURIComponent(memberId)}`, {
    method: "DELETE",
  });
}
