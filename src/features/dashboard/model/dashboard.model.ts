export type DashboardStat = {
  label: string;
  value: string;
  note: string;
  tone: "violet" | "blue" | "green" | "amber";
};

export type RecentTicket = {
  subject: string;
  customer: string;
  initials: string;
  status: "Open" | "In progress" | "Resolved";
  time: string;
};

export type DashboardOverviewData = {
  stats: DashboardStat[];
  recentTickets: RecentTicket[];
  activity: { title: string; detail: string; time: string; initials: string }[];
};
