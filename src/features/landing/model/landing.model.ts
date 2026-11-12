export type LandingFeature = {
  title: string;
  description: string;
  icon: "sparkles" | "ticket" | "book" | "bot" | "users" | "chart";
};

export const landingFeatures: LandingFeature[] = [
  {
    title: "AI-powered support",
    description:
      "Give your team a thoughtful assistant that can find relevant answers in your company knowledge.",
    icon: "sparkles",
  },
  {
    title: "Smart ticket management",
    description:
      "Keep every request organized with a clear view of ownership, priority, and next steps.",
    icon: "ticket",
  },
  {
    title: "Knowledge-base intelligence",
    description:
      "Bring help articles and internal resources together in one place for your support team.",
    icon: "book",
  },
  {
    title: "AI agents and automation",
    description:
      "Design assistive workflows that help your team respond consistently and with context.",
    icon: "bot",
  },
  {
    title: "Team collaboration",
    description:
      "Share context and coordinate handoffs without losing the customer conversation.",
    icon: "users",
  },
  {
    title: "Actionable analytics",
    description:
      "Understand support activity with a focused view of the metrics your team cares about.",
    icon: "chart",
  },
];
