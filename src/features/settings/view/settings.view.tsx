import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
import { getSettingsPageContent } from "../viewmodel/getSettingsPageContent";

export function SettingsView() {
  return <FeaturePlaceholder content={getSettingsPageContent()} />;
}
