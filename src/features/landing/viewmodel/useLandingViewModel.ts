import { landingFeatures } from "../model/landing.model";

export function useLandingViewModel() {
  return {
    features: landingFeatures,
    steps: [
      {
        number: "01",
        title: "Connect your knowledge",
        description:
          "Bring your support guides and company resources into one organized workspace.",
      },
      {
        number: "02",
        title: "Understand every question",
        description:
          "Give your team the context to find relevant information as customer questions arrive.",
      },
      {
        number: "03",
        title: "Move work forward",
        description:
          "Use clear workflows and helpful automation to keep every conversation moving.",
      },
    ],
  };
}
