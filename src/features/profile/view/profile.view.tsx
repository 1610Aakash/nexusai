import type { ProfileUser } from "../model/profile.model";
import { ProfileForm } from "../components/profile-form";

export function ProfileView({ user }: { user: ProfileUser }) {
  return <ProfileForm user={user} />;
}
