import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getInboxPageContent } from "../viewmodel/getInboxPageContent";

export function InboxView() {
  return <FeaturePlaceholder content={getInboxPageContent()} />;
}
