"use client";

import Link from "next/link";
import { CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordViewModel } from "../viewmodel/useForgotPasswordViewModel";

export function ForgotPasswordForm() {
  const { form, submit, submitted, error, isSubmitting } = useForgotPasswordViewModel();

  if (submitted) {
    return (
      <div className="mt-7 rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">
        <CheckCircle2 className="size-6 text-emerald-700" aria-hidden="true" />
        <h2 className="mt-3 font-semibold text-slate-900">Check your inbox</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          If an account exists for that email, password reset instructions will be sent.
        </p>
        <Link href="/login" className="mt-4 inline-flex text-sm font-medium text-violet-700">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={submit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input id="forgot-email" type="email" autoComplete="email" placeholder="you@company.com" className="pl-9" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
        </div>
        {form.formState.errors.email && <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>}
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
        Send reset instructions
      </Button>
      <p className="text-center text-sm text-slate-500">
        Remembered your password? <Link href="/login" className="font-medium text-violet-700">Sign in</Link>
      </p>
    </form>
  );
}
