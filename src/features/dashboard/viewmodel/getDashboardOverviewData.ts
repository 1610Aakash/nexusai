import type { DashboardOverviewData } from "../model/dashboard.model";

export function getDashboardOverviewData(): DashboardOverviewData {
  return {
    stats: [
      { label: "Total tickets", value: "1,284", note: "Illustrative sample", tone: "violet" },
      { label: "Open tickets", value: "42", note: "Illustrative sample", tone: "blue" },
      { label: "Resolved tickets", value: "986", note: "Illustrative sample", tone: "green" },
      { label: "AI resolved tickets", value: "28", note: "Illustrative sample", tone: "amber" },
    ],
    recentTickets: [
      { subject: "Question about my recent order", customer: "Jamie Lee", initials: "JL", status: "Open", time: "8 min ago" },
      { subject: "Need help updating account details", customer: "Morgan Chen", initials: "MC", status: "In progress", time: "24 min ago" },
      { subject: "Getting started with the workspace", customer: "Sam Rivera", initials: "SR", status: "Resolved", time: "1 hr ago" },
      { subject: "Invoice for the latest billing cycle", customer: "Taylor Kim", initials: "TK", status: "Open", time: "2 hrs ago" },
    ],
    activity: [
      { title: "Conversation assigned", detail: "Jamie Lee · Order question", time: "8 min ago", initials: "AD" },
      { title: "Ticket marked resolved", detail: "Morgan Chen · Account access", time: "32 min ago", initials: "JD" },
      { title: "Knowledge article added", detail: "Getting started guide", time: "Yesterday", initials: "SK" },
    ],
  };
}
