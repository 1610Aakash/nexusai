import { BrandMark } from "@/features/landing/components/brand-mark";
import { SignupForm } from "../components/signup-form";

export function SignupView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_50%_0%,#f0ebff_0%,#ffffff_55%)] px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <BrandMark />
        <p className="mt-8 text-sm font-semibold text-violet-700">Get started</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Create your NexusAI account</h1>
        <p className="mt-2 text-sm text-slate-600">Start with your account, then create your workspace.</p>
        <SignupForm />
      </section>
    </main>
  );
}
