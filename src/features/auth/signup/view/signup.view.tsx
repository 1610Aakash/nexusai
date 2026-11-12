import { BrandMark } from "@/features/landing/components/brand-mark";
import { SignupNotice } from "../components/signup-notice";
import { getSignupPageContent } from "../viewmodel/getSignupPageContent";

export function SignupView() {
  const content = getSignupPageContent();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_50%_0%,#f0ebff_0%,#ffffff_55%)] px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <BrandMark />
        <p className="mt-8 text-sm font-semibold text-violet-700">Get started</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{content.heading}</h1>
        <SignupNotice description={content.description} />
      </section>
    </main>
  );
}
