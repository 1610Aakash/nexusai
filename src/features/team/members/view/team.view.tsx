import { TeamDashboard } from "../components/team-dashboard";

export function TeamView({ ownerId }: { ownerId: string }) {
  return <TeamDashboard ownerId={ownerId} />;
}
