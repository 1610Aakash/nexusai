import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getTicketsPageContent } from "../viewmodel/getTicketsPageContent";

export function TicketsView() {
  return <FeaturePlaceholder content={getTicketsPageContent()} />;
}
