import Link from "next/link";

export function SignupNotice({ description }: { description: string }) {
  return (
    <>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <Link href="/" className="mt-7 inline-flex text-sm font-medium text-violet-700 hover:text-violet-900">
        Back to the homepage
      </Link>
      <p className="mt-8 border-t border-slate-100 pt-5 text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-violet-700 hover:text-violet-900">Sign in</Link>
      </p>
    </>
  );
}
