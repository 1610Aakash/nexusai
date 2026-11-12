import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getAnalyticsPageContent } from "../viewmodel/getAnalyticsPageContent";

export function AnalyticsView() {
  return <FeaturePlaceholder content={getAnalyticsPageContent()} />;
}
