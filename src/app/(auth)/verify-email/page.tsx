import { Suspense } from "react";
import { VerifyEmailView } from "@/features/auth/verify-email/view/verify-email.view";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <VerifyEmailPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function VerifyEmailPageContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;
  return <VerifyEmailView token={token ?? ""} email={email ?? ""} />;
}
