import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CircleCheck,
  Clock3,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardOverviewData, DashboardStat, RecentTicket } from "../model/dashboard.model";

const statIcons = {
  violet: MessageSquareText,
  blue: Clock3,
  green: CircleCheck,
  amber: Bot,
} as const;

const statStyles = {
  violet: "bg-violet-50 text-violet-700",
  blue: "bg-sky-50 text-sky-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
} as const;

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = statIcons[stat.tone];
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 bg-white p-5 shadow-none">
      <div className="flex items-start justify-between">
        <span className={`flex size-10 items-center justify-center rounded-xl ${statStyles[stat.tone]}`}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          Sample
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
      <p className="mt-1 text-xs font-medium text-slate-600">{stat.label}</p>
      <p className="mt-3 text-[11px] text-slate-400">{stat.note}</p>
    </Card>
  );
}

function TicketStatus({ status }: { status: RecentTicket["status"] }) {
  const colors = {
    Open: "border-amber-200 bg-amber-50 text-amber-700",
    "In progress": "border-sky-200 bg-sky-50 text-sky-700",
    Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return <Badge variant="outline" className={`rounded-full font-medium ${colors[status]}`}>{status}</Badge>;
}

function TicketTrendChart() {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 p-5 shadow-none sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Ticket trends</h2>
          <p className="mt-1 text-xs text-slate-500">Illustrative activity over the past week</p>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="More trend options">
          <MoreHorizontal />
        </Button>
      </div>
      <div className="mt-5">
        <div className="mb-3 flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-violet-600" />Incoming</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-emerald-500" />Resolved</span>
        </div>
        <div className="relative h-52 w-full overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map((line) => <span key={line} className="border-t border-dashed border-slate-100" />)}
          </div>
          <svg
            viewBox="0 0 640 180"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            role="img"
            aria-label="Illustrative comparison of incoming and resolved tickets across seven days"
          >
            <path d="M0 139C42 127 48 102 91 113S144 89 183 101 225 68 274 82 319 102 365 71 418 80 457 53 509 71 548 42 596 55 640 28" fill="none" stroke="#7555e8" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            <path d="M0 154C47 142 51 130 91 136S144 109 183 118 226 91 274 106 321 111 365 91 418 96 457 78 508 89 548 66 595 69 640 53" fill="none" stroke="#10b981" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-400 sm:text-xs">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}
        </div>
      </div>
    </Card>
  );
}

function RecentTickets({ tickets }: { tickets: RecentTicket[] }) {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 p-5 shadow-none sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Recent tickets</h2>
          <p className="mt-1 text-xs text-slate-500">Sample conversations for layout preview</p>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Add ticket (not available yet)" disabled>
          <Plus />
        </Button>
      </div>
      <div className="mt-4 divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <div key={ticket.subject} className="flex items-center gap-3 py-3.5">
            <Avatar className="size-9">
              <AvatarFallback className="bg-slate-100 text-[10px] font-semibold text-slate-600">{ticket.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-800">{ticket.subject}</p>
              <p className="mt-1 text-[11px] text-slate-500">{ticket.customer} · {ticket.time}</p>
            </div>
            <div className="hidden sm:block"><TicketStatus status={ticket.status} /></div>
          </div>
        ))}
      </div>
      <p className="mt-2 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
        Ticket management will be available in a future release.
      </p>
    </Card>
  );
}

function RecentActivity({ activity }: { activity: DashboardOverviewData["activity"] }) {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 p-5 shadow-none sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Recent activity</h2>
          <p className="mt-1 text-xs text-slate-500">Sample team updates</p>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="More activity options"><MoreHorizontal /></Button>
      </div>
      <div className="mt-5 space-y-5">
        {activity.map((item, index) => (
          <div key={item.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Avatar className="size-8">
                <AvatarFallback className="bg-violet-50 text-[10px] font-semibold text-violet-700">{item.initials}</AvatarFallback>
              </Avatar>
              {index < activity.length - 1 && <span className="mt-1 min-h-4 w-px flex-1 bg-slate-100" />}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-xs font-medium text-slate-800">{item.title}</p>
              <p className="mt-1 truncate text-[11px] text-slate-500">{item.detail}</p>
              <p className="mt-1.5 text-[10px] text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SupportPerformance() {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 p-5 shadow-none sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Support performance</h2>
          <p className="mt-1 text-xs text-slate-500">Illustrative values only</p>
        </div>
        <Sparkles className="size-4 text-violet-500" aria-hidden="true" />
      </div>
      <div className="mt-5 space-y-5">
        {[
          { label: "First response", value: "4m 20s", width: "68%", tone: "bg-violet-500", icon: ArrowDownRight },
          { label: "Resolution time", value: "2h 15m", width: "54%", tone: "bg-sky-500", icon: ArrowDownRight },
          { label: "Customer satisfaction", value: "4.8 / 5", width: "84%", tone: "bg-emerald-500", icon: ArrowUpRight },
        ].map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600">{metric.label}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                <metric.icon className="size-3 text-emerald-600" aria-hidden="true" />
                {metric.value}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <span className={`block h-full rounded-full ${metric.tone}`} style={{ width: metric.width }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DashboardOverview({ data }: { data: DashboardOverviewData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-violet-700">Workspace overview</p>
            <Badge variant="outline" className="rounded-full border-amber-200 bg-amber-50 text-[10px] text-amber-800">Demo data</Badge>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Good morning, Jordan</h2>
          <p className="mt-1 text-sm text-slate-500">Here’s a sample snapshot of your support workspace.</p>
        </div>
        <Button variant="outline" className="w-fit" disabled>
          <Plus data-icon="inline-start" />
          New ticket
        </Button>
      </div>

      <div role="note" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs leading-5 text-amber-900">
        <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p><strong>Preview only:</strong> all numbers, activity, and ticket examples below are sample data and are not connected to a live database.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.85fr]">
        <TicketTrendChart />
        <SupportPerformance />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.85fr]">
        <RecentTickets tickets={data.recentTickets} />
        <RecentActivity activity={data.activity} />
      </div>
    </div>
  );
}
