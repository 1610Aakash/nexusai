"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPasswordViewModel } from "../viewmodel/useResetPasswordViewModel";

export function ResetPasswordForm({ token }: { token: string }) {
  const { form, submit, error, success, returnToLogin, isSubmitting } = useResetPasswordViewModel(token);
  const [visible, setVisible] = useState(false);

  if (!token) {
    return <p role="alert" className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">This reset link is incomplete. Request a new one to continue.</p>;
  }

  if (success) {
    return (
      <div className="mt-7 rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">
        <CheckCircle2 className="size-6 text-emerald-700" aria-hidden="true" />
        <h2 className="mt-3 font-semibold text-slate-900">Password updated</h2>
        <p className="mt-2 text-sm text-slate-600">Your other sessions have been invalidated. Sign in with your new password.</p>
        <Button className="mt-4" onClick={returnToLogin}>Continue to sign in</Button>
      </div>
    );
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={submit} noValidate>
      {(["password", "confirmPassword"] as const).map((field) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={`reset-${field}`}>{field === "password" ? "New password" : "Confirm new password"}</Label>
          <div className="relative">
            <Input id={`reset-${field}`} type={visible ? "text" : "password"} autoComplete="new-password" placeholder={field === "password" ? "At least 12 characters" : "Re-enter your password"} className="pr-11" aria-invalid={Boolean(form.formState.errors[field])} {...form.register(field)} />
            {field === "password" && (
              <button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400">
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            )}
          </div>
          {form.formState.errors[field] && <p className="text-xs text-red-600">{form.formState.errors[field].message}</p>}
        </div>
      ))}
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
        Update password
      </Button>
      <p className="text-center text-sm text-slate-500"><Link href="/forgot-password" className="font-medium text-violet-700">Request another reset link</Link></p>
    </form>
  );
}
