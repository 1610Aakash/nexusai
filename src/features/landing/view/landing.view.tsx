import { useLandingViewModel } from "../viewmodel/useLandingViewModel";
import { BenefitsSection } from "../components/benefits-section";
import { CtaSection } from "../components/cta-section";
import { FeaturesSection } from "../components/features-section";
import { HeroSection } from "../components/hero-section";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { WorkflowSection } from "../components/workflow-section";

export function LandingView() {
  const { features, steps } = useLandingViewModel();

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection features={features} />
        <WorkflowSection steps={steps} />
        <BenefitsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
