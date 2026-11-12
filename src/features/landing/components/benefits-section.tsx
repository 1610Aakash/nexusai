import { Check } from "lucide-react";

const benefits = [
  "A shared view of every customer conversation",
  "Helpful context from your team’s knowledge",
  "Clear ownership and smoother handoffs",
  "Workflows designed around your support team",
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-10">
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-medium text-violet-200">A calmer way to work</p>
            <h3 className="mt-4 max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
              Put the right context in reach of every conversation.
            </h3>
            <div className="mt-9 space-y-3">
              {["Customer conversation", "Relevant help article", "Team handoff"].map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 ${
                    index === 1 ? "ml-5 sm:ml-10" : ""
                  }`}
                >
                  <span className="size-2 rounded-full bg-violet-300" />
                  <span className="text-sm text-slate-200">{item}</span>
                  {index === 1 && <span className="ml-auto text-xs text-violet-200">In context</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-violet-700">Designed for the whole team</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Support that feels connected from first hello to follow-up
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Give support teams a shared foundation to organize requests, collaborate, and make
            informed decisions as the work evolves.
          </p>
          <ul className="mt-7 space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
