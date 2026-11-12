import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <BrandMark />
          <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
            A thoughtful foundation for modern customer support.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
          <Link href="/login" className="transition-colors hover:text-violet-700">Log in</Link>
          <Link href="/signup" className="transition-colors hover:text-violet-700">Get started</Link>
          <a href="#features" className="transition-colors hover:text-violet-700">Features</a>
          <a href="#workflow" className="transition-colors hover:text-violet-700">How it works</a>
        </div>
        <p className="text-xs text-slate-400">© NexusAI</p>
      </div>
    </footer>
  );
}
