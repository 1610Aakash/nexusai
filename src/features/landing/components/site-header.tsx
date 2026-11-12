import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { BrandMark } from "./brand-mark";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#workflow" },
  { label: "Solutions", href: "#benefits" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <BrandMark />
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-700"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            Get started
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <details className="group relative md:hidden">
          <summary
            aria-label="Open navigation menu"
            className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-700"
          >
            <Menu className="size-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-12 z-50 flex w-56 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-800"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-violet-50"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="mt-1 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white"
            >
              Get started
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
