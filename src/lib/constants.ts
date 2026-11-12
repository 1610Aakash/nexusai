export const APP_NAME = "NexusAI";

export const APP_DESCRIPTION =
  "Customer support, powered by your team’s knowledge and thoughtful automation.";

export const DASHBOARD_NAVIGATION = [
  { label: "Overview", href: "/dashboard", icon: "layout" },
  { label: "Tickets", href: "/tickets", icon: "ticket" },
  { label: "Inbox", href: "/inbox", icon: "inbox" },
  { label: "Customers", href: "/customers", icon: "users" },
  { label: "Knowledge Base", href: "/knowledge-base", icon: "book" },
  { label: "AI Agents", href: "/ai-agents", icon: "sparkles" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Analytics", href: "/analytics", icon: "chart" },
  { label: "Settings", href: "/settings", icon: "settings" },
] as const;
