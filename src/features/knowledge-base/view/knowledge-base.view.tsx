import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getKnowledgeBasePageContent } from "../viewmodel/getKnowledgeBasePageContent";

export function KnowledgeBaseView() {
  return <FeaturePlaceholder content={getKnowledgeBasePageContent()} />;
}
