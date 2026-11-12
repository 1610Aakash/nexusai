import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getTeamPageContent } from "../viewmodel/getTeamPageContent";

export function TeamView() {
  return <FeaturePlaceholder content={getTeamPageContent()} />;
}
