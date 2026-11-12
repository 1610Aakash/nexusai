"use client";

import { ArrowLeft, ArrowRight, Check, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { useOnboardingViewModel } from "../viewmodel/useOnboardingViewModel";

const steps = ["Welcome", "Workspace details", "Review", "Finish"];

export function OnboardingWizard({ userName }: { userName: string }) {
  const { form, step, next, back, create, updateName, error, isSubmitting } =
    useOnboardingViewModel();
  const values = form.watch();

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,#f0ebff_0%,#ffffff_55%)] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <BrandMark />
          <SignOutButton className="text-slate-500" />
        </div>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-9">
            <div className="flex items-center justify-between gap-2">
              {steps.map((label, index) => (
                <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index < step ? "bg-emerald-100 text-emerald-700" : index === step ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {index < step ? <Check className="size-4" /> : index + 1}
                  </span>
                  <span className={`hidden truncate text-xs sm:block ${index === step ? "font-medium text-slate-900" : "text-slate-400"}`}>{label}</span>
                  {index < steps.length - 1 && <span className="h-px min-w-2 flex-1 bg-slate-200" />}
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <span className="block h-full rounded-full bg-violet-600 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </div>
          </div>

          {step === 0 && (
            <section className="py-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Sparkles className="size-6" /></span>
              <p className="mt-6 text-sm font-semibold text-violet-700">Welcome{userName ? `, ${userName}` : ""}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Let’s set up your support workspace.</h1>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">Create an organization for your team. You’ll be its first administrator, and you can invite teammates when you’re ready.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {["Choose a recognizable organization name", "Set a workspace URL for your team", "Review everything before creating"].map((item) => (
                  <li key={item} className="flex items-center gap-2"><Check className="size-4 text-emerald-600" />{item}</li>
                ))}
              </ul>
            </section>
          )}

          {step === 1 && (
            <section>
              <p className="text-sm font-semibold text-violet-700">Workspace details</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Tell us about your organization</h1>
              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization name</Label>
                  <Input id="organization-name" placeholder="Acme Support" aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name", { onChange: (event) => updateName(event.target.value) })} />
                  {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-slug">Workspace URL</Label>
                  <div className="flex min-w-0 items-center rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring/40">
                    <span className="shrink-0 pl-3 text-xs text-slate-400">nexusai.app/</span>
                    <Input id="organization-slug" className="border-0 shadow-none focus-visible:ring-0" placeholder="acme-support" aria-invalid={Boolean(form.formState.errors.slug)} {...form.register("slug")} />
                  </div>
                  {form.formState.errors.slug && <p className="text-xs text-red-600">{form.formState.errors.slug.message}</p>}
                  <p className="text-xs text-slate-400">Workspace URLs must be unique. Availability is checked when you create the workspace.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-description">Description <span className="font-normal text-slate-400">(optional)</span></Label>
                  <Textarea id="organization-description" placeholder="What does your support team help customers with?" rows={3} {...form.register("description")} />
                  {form.formState.errors.description && <p className="text-xs text-red-600">{form.formState.errors.description.message}</p>}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <p className="text-sm font-semibold text-violet-700">Review</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Does everything look right?</h1>
              <p className="mt-2 text-sm text-slate-600">You’ll become an administrator of this organization.</p>
              <dl className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
                <div className="py-4"><dt className="text-xs text-slate-500">Organization</dt><dd className="mt-1 font-medium text-slate-900">{values.name}</dd></div>
                <div className="py-4"><dt className="text-xs text-slate-500">Workspace URL</dt><dd className="mt-1 font-medium text-slate-900">nexusai.app/{values.slug}</dd></div>
                <div className="py-4"><dt className="text-xs text-slate-500">Description</dt><dd className="mt-1 text-sm text-slate-700">{values.description || "No description provided"}</dd></div>
                <div className="py-4"><dt className="text-xs text-slate-500">Your role</dt><dd className="mt-1 font-medium text-slate-900">Administrator</dd></div>
              </dl>
            </section>
          )}

          {step === 3 && (
            <section className="py-6 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Check className="size-7" /></span>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Your workspace is ready to create.</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">NexusAI will create your organization and administrator membership together.</p>
            </section>
          )}

          {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <Button type="button" variant="outline" onClick={back} disabled={step === 0 || isSubmitting}>
              <ArrowLeft data-icon="inline-start" /> Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={next}>
                Continue <ArrowRight data-icon="inline-end" />
              </Button>
            ) : (
              <Button type="button" onClick={create} disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
                Create workspace
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
