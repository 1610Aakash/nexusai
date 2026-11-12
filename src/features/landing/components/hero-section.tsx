import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ProductPreview } from "./product-preview";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#f0ebff_0%,#ffffff_55%)]">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:pb-28 lg:pt-28">
        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-violet-800 shadow-sm">
            <span className="size-1.5 rounded-full bg-violet-600" />
            A clearer way to support your customers
          </div>
          <h1 className="text-4xl font-semibold leading-[1.12] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[3.6rem]">
            Customer Support,{" "}
            <span className="bg-gradient-to-r from-violet-700 to-indigo-500 bg-clip-text text-transparent">
              Powered by Intelligence.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Bring conversations, company knowledge, and your support team together.
            NexusAI helps every response feel more informed and every workflow more
            manageable.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href="#product-preview"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-violet-200 hover:bg-violet-50"
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
              View product preview
            </a>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Built for support teams who want clarity, not more complexity.
          </p>
        </div>
        <div id="product-preview" className="relative px-1 sm:px-4 lg:px-0">
          <div className="absolute -right-8 -top-8 -z-10 size-48 rounded-full bg-indigo-200/50 blur-3xl" />
          <ProductPreview />
          <div className="absolute -bottom-5 left-0 hidden items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-lg sm:flex lg:-left-7">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowRight className="size-4 -rotate-45" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-slate-900">Everything in context</span>
              <span className="block text-[11px] text-slate-500">A calmer support workspace</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
