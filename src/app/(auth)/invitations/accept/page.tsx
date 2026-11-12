import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AcceptInvitationView } from "@/features/team/invitations/view/accept-invitation.view";
import { isEmailVerificationRequired } from "@/lib/auth/email-verification";

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    const next = `/invitations/accept?token=${encodeURIComponent(token ?? "")}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  if (isEmailVerificationRequired() && !user.isEmailVerified) redirect("/verify-email");
  return <AcceptInvitationView token={token ?? ""} userEmail={user.email} />;
}
