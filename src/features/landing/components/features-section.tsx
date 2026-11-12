import {
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  MessageSquareText,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LandingFeature } from "../model/landing.model";

const icons: Record<LandingFeature["icon"], LucideIcon> = {
  sparkles: Sparkles,
  ticket: MessageSquareText,
  book: BookOpen,
  bot: Bot,
  users: UsersRound,
  chart: ChartNoAxesCombined,
};

export function FeaturesSection({ features }: { features: LandingFeature[] }) {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-violet-700">One workspace, better support</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            The tools your support team needs, working together
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            NexusAI brings the moving parts of customer support into a single, thoughtful workspace.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <Card
                key={feature.title}
                className="group rounded-2xl border-slate-200/80 p-6 shadow-none transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/70"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition-colors group-hover:bg-violet-100">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
