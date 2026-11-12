import Link from "next/link";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { ForgotPasswordForm } from "../components/forgot-password-form";

export function ForgotPasswordView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_50%_0%,#f0ebff_0%,#ffffff_55%)] px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <BrandMark />
        <p className="mt-8 text-sm font-semibold text-violet-700">Account recovery</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter your account email and we’ll send reset instructions if there’s a matching account.</p>
        <ForgotPasswordForm />
        <Link href="/" className="mt-6 inline-flex text-xs text-slate-500 hover:text-violet-700">Back to home</Link>
      </section>
    </main>
  );
}
