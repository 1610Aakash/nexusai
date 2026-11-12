import { ArrowRight } from "lucide-react";

type WorkflowStep = {
  number: string;
  title: string;
  description: string;
};

export function WorkflowSection({ steps }: { steps: WorkflowStep[] }) {
  return (
    <section id="workflow" className="scroll-mt-24 border-y border-slate-100 bg-slate-50/70 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-violet-700">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A simpler path from question to resolution
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Start with the information you already have, then give your team a more connected way to work.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => (
            <article key={step.number} className="relative">
              <p className="text-sm font-semibold tracking-wide text-violet-700">{step.number}</p>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight
                  className="absolute right-0 top-2 hidden size-5 text-violet-300 md:block"
                  aria-hidden="true"
                />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
