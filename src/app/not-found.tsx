import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-violet-700">404 · Page not found</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page isn’t here.</h1>
        <p className="mt-3 text-muted-foreground">
          The page may have moved, or the link may be incorrect.
        </p>
        <Link href="/" className={`${buttonVariants()} mt-7`}>
          <ArrowLeft data-icon="inline-start" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
