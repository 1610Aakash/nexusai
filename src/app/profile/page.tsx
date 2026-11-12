import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { ProfileView } from "@/features/profile/view/profile.view";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ProfileView user={{ ...user, lastLoginAt: user.lastLoginAt?.toISOString() ?? null }} />;
}
