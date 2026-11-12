"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestApi } from "../model/auth-api.model";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signOut = async () => {
    setBusy(true);
    setError("");
    try {
      await requestApi("/api/auth/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign out");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className={className}>
      <Button type="button" variant="ghost" size="sm" onClick={() => void signOut()} disabled={busy}>
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
        Sign out
      </Button>
      {error && <span role="alert" className="ml-2 text-xs text-red-600">{error}</span>}
    </span>
  );
}
