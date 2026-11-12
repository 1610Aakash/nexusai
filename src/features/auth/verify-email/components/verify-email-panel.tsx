"use client";

import Link from "next/link";
import { CheckCircle2, LoaderCircle, MailCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyEmailViewModel } from "../viewmodel/useVerifyEmailViewModel";

export function VerifyEmailPanel({
  token,
  initialEmail,
}: {
  token: string;
  initialEmail: string;
}) {
  const { status, error, form, resend, resendMessage, isResending } =
    useVerifyEmailViewModel(token, initialEmail);

  return (
    <div className="mt-7">
      {status === "verifying" && (
        <div role="status" className="flex items-center gap-3 rounded-xl bg-violet-50 p-4 text-sm text-violet-800">
          <LoaderCircle className="size-5 animate-spin" /> Verifying your email…
        </div>
      )}
      {status === "verified" && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">
          <CheckCircle2 className="size-6 text-emerald-700" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-slate-900">Email verified</h2>
          <p className="mt-2 text-sm text-slate-600">Your account is ready. Sign in to continue to workspace setup.</p>
          <Link href="/login" className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700">
            Continue to sign in
          </Link>
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-red-800">
            <XCircle className="size-4" /> Verification could not be completed
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}
      {resendMessage && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{resendMessage}</p>}
      {status !== "verified" && (
        <form className="mt-5 space-y-3 border-t border-slate-100 pt-5" onSubmit={resend} noValidate>
          <div className="space-y-2">
            <Label htmlFor="verification-email">Need a new verification link?</Label>
            <div className="flex gap-2">
              <Input id="verification-email" type="email" placeholder="you@company.com" {...form.register("email")} />
              <Button type="submit" variant="outline" disabled={isResending}>
                {isResending ? <LoaderCircle className="size-4 animate-spin" /> : <MailCheck className="size-4" />}
                <span className="hidden sm:inline">Resend</span>
              </Button>
            </div>
            {form.formState.errors.email && <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>}
          </div>
          {error && status !== "error" && <p role="alert" className="text-xs text-red-600">{error}</p>}
        </form>
      )}
      <p className="mt-5 text-sm text-slate-500">Already verified? <Link href="/login" className="font-medium text-violet-700">Sign in</Link></p>
    </div>
  );
}
