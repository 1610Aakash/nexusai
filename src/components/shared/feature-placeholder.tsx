import Link from "next/link";
import { ArrowRight, Construction, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FeaturePageContent } from "@/types/feature-page";

export function FeaturePlaceholder({ content }: { content: FeaturePageContent }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-violet-700">Workspace</p>
          <Badge variant="outline" className="rounded-full">Coming soon</Badge>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{content.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{content.description}</p>
      </div>

      <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <Construction className="size-6" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-slate-900">This workspace is being prepared</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{content.preview}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
          <Sparkles className="size-3.5 text-violet-600" aria-hidden="true" />
          Part 1 foundation preview
        </div>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition-colors hover:text-violet-900"
        >
          Return to overview
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
