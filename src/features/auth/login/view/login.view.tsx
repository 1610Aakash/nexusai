import Link from "next/link";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { LoginForm } from "../components/login-form";

export function LoginView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_50%_0%,#f0ebff_0%,#ffffff_55%)] px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <BrandMark />
        <p className="mt-8 text-sm font-semibold text-violet-700">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Sign in to NexusAI</h1>
        <p className="mt-2 text-sm text-slate-600">Continue to your support workspace.</p>
        <LoginForm />
        <p className="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          New to NexusAI?{" "}
          <Link href="/signup" className="font-medium text-violet-700 hover:text-violet-900">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
