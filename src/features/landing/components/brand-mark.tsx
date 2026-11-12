import Link from "next/link";
import { Sparkles } from "lucide-react";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${
        light ? "text-white" : "text-slate-950"
      }`}
      aria-label="NexusAI home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg">NexusAI</span>
    </Link>
  );
}
