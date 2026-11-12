import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getCustomersPageContent } from "../viewmodel/getCustomersPageContent";

export function CustomersView() {
  return <FeaturePlaceholder content={getCustomersPageContent()} />;
}
