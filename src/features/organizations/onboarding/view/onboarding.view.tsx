import { OnboardingWizard } from "../components/onboarding-wizard";

export function OnboardingView({ userName }: { userName: string }) {
  return <OnboardingWizard userName={userName} />;
}
