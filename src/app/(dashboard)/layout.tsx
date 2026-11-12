import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from "next/navigation";
import { getCurrentOrganization, getCurrentUser } from "@/lib/auth/session";
import { isEmailVerificationRequired } from "@/lib/auth/email-verification";
import { listOrganizations } from "@/server/services/organization.service";

export default function DashboardRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return protectDashboard(children);
}

async function protectDashboard(children: React.ReactNode) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (isEmailVerificationRequired() && !user.isEmailVerified) redirect("/verify-email");
  const organization = await getCurrentOrganization(user.id);
  if (!organization) redirect("/onboarding");
  const organizations = await listOrganizations(user.id);
  return (
    <DashboardLayout user={user} organization={organization} organizations={organizations}>
      {children}
    </DashboardLayout>
  );
}
