import { redirect } from "next/navigation";
import { getCurrentOrganization, getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { TeamView } from "@/features/team/members/view/team.view";
import { isEmailVerificationRequired } from "@/lib/auth/email-verification";

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (isEmailVerificationRequired() && !user.isEmailVerified) redirect("/verify-email");
  const organization = await getCurrentOrganization(user.id);
  if (!organization) redirect("/onboarding");
  if (!hasPermission(organization.role, "members:read")) redirect("/dashboard");
  return <TeamView ownerId={organization.ownerId} />;
}
