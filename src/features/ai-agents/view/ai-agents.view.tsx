import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getAiAgentsPageContent } from "../viewmodel/getAiAgentsPageContent";

export function AiAgentsView() {
  return <FeaturePlaceholder content={getAiAgentsPageContent()} />;
}
