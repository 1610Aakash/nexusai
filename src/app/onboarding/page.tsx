import { redirect } from "next/navigation";
import { getCurrentOrganization, getCurrentUser } from "@/lib/auth/session";
import { OnboardingView } from "@/features/organizations/onboarding/view/onboarding.view";
import { isEmailVerificationRequired } from "@/lib/auth/email-verification";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (isEmailVerificationRequired() && !user.isEmailVerified) redirect("/verify-email");
  const organization = await getCurrentOrganization(user.id);
  if (organization) redirect("/dashboard");
  return <OnboardingView userName={user.name} />;
}
