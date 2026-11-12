"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application rendering error", {
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-violet-700">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          We couldn’t load this page.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Please try again. If the problem continues, come back in a little while.
        </p>
        <Button className="mt-7" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
