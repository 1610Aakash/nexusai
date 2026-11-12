import { DashboardOverview } from "../components/dashboard-overview";
import { getDashboardOverviewData } from "../viewmodel/getDashboardOverviewData";

export function DashboardView() {
  return <DashboardOverview data={getDashboardOverviewData()} />;
}
