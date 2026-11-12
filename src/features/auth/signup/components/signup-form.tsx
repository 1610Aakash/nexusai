"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignupViewModel } from "../viewmodel/useSignupViewModel";

export function SignupForm() {
  const { form, submit, error, isSubmitting } = useSignupViewModel();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <form className="mt-7 space-y-4" onSubmit={submit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full name</Label>
        <Input id="signup-name" autoComplete="name" placeholder="Jordan Davis" aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
        {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Work email</Label>
        <Input id="signup-email" type="email" autoComplete="email" placeholder="you@company.com" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
        {form.formState.errors.email && <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 12 characters" className="pr-11" aria-invalid={Boolean(form.formState.errors.password)} {...form.register("password")} />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700">
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.password && <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirm password</Label>
        <div className="relative">
          <Input id="signup-confirm" type={showConfirmation ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter your password" className="pr-11" aria-invalid={Boolean(form.formState.errors.confirmPassword)} {...form.register("confirmPassword")} />
          <button type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? "Hide confirmation" : "Show confirmation"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700">
            {showConfirmation ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.confirmPassword && <p className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>}
      </div>
      <div className="space-y-1">
        <label className="flex items-start gap-2.5 text-xs leading-5 text-slate-600">
          <input type="checkbox" className="mt-1 accent-violet-600" {...form.register("termsAccepted")} />
          <span>I agree to the terms of service and privacy policy.</span>
        </label>
        {form.formState.errors.termsAccepted && <p className="text-xs text-red-600">{form.formState.errors.termsAccepted.message}</p>}
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
        Create account
      </Button>
      <p className="text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" className="font-medium text-violet-700 hover:text-violet-900">Sign in</Link>
      </p>
    </form>
  );
}
