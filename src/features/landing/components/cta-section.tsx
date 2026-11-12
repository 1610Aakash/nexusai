import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section id="pricing" className="scroll-mt-20 px-5 pb-20 sm:px-8 sm:pb-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-700 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
        <div className="absolute -left-16 -top-24 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-12 size-72 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Make room for better conversations.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-violet-100">
            Give your support team one connected place to understand requests and move work forward.
          </p>
          <Link
            href="/signup"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50"
          >
            Get started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
