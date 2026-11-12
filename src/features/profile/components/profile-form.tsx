"use client";

import { CheckCircle2, LoaderCircle, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileUser } from "../model/profile.model";
import { useProfileViewModel } from "../viewmodel/useProfileViewModel";

export function ProfileForm({ user }: { user: ProfileUser }) {
  const { form, submit, message, error, isSubmitting } = useProfileViewModel(user);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-700">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Your profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the personal details associated with your account.</p>
      </div>
      <form className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7" onSubmit={submit} noValidate>
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <Avatar className="size-14">
            <AvatarFallback className="bg-violet-100 text-violet-700"><UserRound className="size-6" /></AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{user.name}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full name</Label>
            <Input id="profile-name" autoComplete="name" aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
            {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-avatar">Avatar URL <span className="font-normal text-slate-400">(optional)</span></Label>
            <Input id="profile-avatar" type="url" placeholder="https://example.com/avatar.png" aria-invalid={Boolean(form.formState.errors.avatar)} {...form.register("avatar")} />
            {form.formState.errors.avatar && <p className="text-xs text-red-600">{form.formState.errors.avatar.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input value={user.email} disabled readOnly />
            <p className="text-xs text-slate-500">Email changes are not available in this release.</p>
          </div>
        </div>
        {message && <p role="status" className="mt-5 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="size-4" />{message}</p>}
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
