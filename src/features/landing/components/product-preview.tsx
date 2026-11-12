import { ArrowUpRight, CircleCheck, Clock3, MessageSquareText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const previewTickets = [
  { name: "Order status update", person: "Jamie Lee", tag: "Billing", color: "bg-sky-100 text-sky-700" },
  { name: "Can’t access my account", person: "Morgan Chen", tag: "Account", color: "bg-violet-100 text-violet-700" },
  { name: "Product setup question", person: "Sam Rivera", tag: "Getting started", color: "bg-emerald-100 text-emerald-700" },
];

export function ProductPreview() {
  return (
    <Card className="relative mx-auto w-full max-w-[600px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-[0_35px_100px_-45px_rgba(74,54,130,0.42)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Support overview</p>
            <p className="text-xs text-slate-500">Sample workspace</p>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full bg-emerald-50 text-emerald-700">
          Preview
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5">
        {[
          { title: "Open", value: "08", icon: MessageSquareText, color: "text-violet-600 bg-violet-50" },
          { title: "Resolved", value: "24", icon: CircleCheck, color: "text-emerald-600 bg-emerald-50" },
          { title: "Waiting", value: "03", icon: Clock3, color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <div key={stat.title} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4">
            <div className={`mb-3 flex size-8 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="size-4" aria-hidden="true" />
            </div>
            <p className="text-xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">{stat.title}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 px-5 pb-5 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-100 p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">Conversation activity</p>
              <p className="mt-1 text-[11px] text-slate-500">A sample weekly view</p>
            </div>
            <ArrowUpRight className="size-4 text-slate-400" aria-hidden="true" />
          </div>
          <svg
            viewBox="0 0 300 100"
            className="h-24 w-full"
            role="img"
            aria-label="Illustrative weekly conversation activity chart"
          >
            <path d="M0 78H300M0 52H300M0 26H300" stroke="#eef0f5" strokeWidth="1" />
            <path
              d="M0 69C20 66 27 72 45 60S73 54 88 60 111 42 129 47 153 38 171 46 201 27 216 35 247 22 266 31 283 16 300 20V100H0Z"
              fill="url(#chart-fill)"
              opacity=".18"
            />
            <path
              d="M0 69C20 66 27 72 45 60S73 54 88 60 111 42 129 47 153 38 171 46 201 27 216 35 247 22 266 31 283 16 300 20"
              fill="none"
              stroke="#7657e8"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7657e8" />
                <stop offset="100%" stopColor="#7657e8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 p-4">
          <p className="mb-3 text-xs font-semibold text-slate-800">Recent conversations</p>
          <div className="space-y-3">
            {previewTickets.map((ticket) => (
              <div key={ticket.name} className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                  {ticket.person.split(" ").map((part) => part[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-slate-800">{ticket.name}</p>
                  <p className="text-[10px] text-slate-500">{ticket.person}</p>
                </div>
                <span className={`hidden rounded-full px-2 py-1 text-[9px] font-medium sm:inline-flex ${ticket.color}`}>
                  {ticket.tag}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
            <Sparkles className="size-3 text-violet-600" aria-hidden="true" />
            A helpful AI suggestion is ready
          </div>
        </div>
      </div>
      <div className="absolute -bottom-16 -left-16 -z-10 size-40 rounded-full bg-violet-300/30 blur-3xl" />
    </Card>
  );
}
