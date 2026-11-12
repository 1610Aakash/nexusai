"use client";

import { Check, LoaderCircle, MailCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { useAcceptInvitationViewModel } from "../viewmodel/useAcceptInvitationViewModel";

export function AcceptInvitationPanel({
  token,
  userEmail,
}: {
  token: string;
  userEmail: string;
}) {
  const { accept, error, busy } = useAcceptInvitationViewModel(token);

  return (
    <div className="mt-7">
      {token ? (
        <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-5">
          <MailCheck className="size-6 text-violet-700" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-700">You’re signed in as <strong>{userEmail}</strong>.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Accepting this invitation grants access only to the organization it was created for.</p>
          {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><XCircle className="mt-0.5 size-4 shrink-0" />{error}</p>}
          <Button className="mt-5 w-full" onClick={() => void accept()} disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}
            Accept invitation
          </Button>
        </div>
      ) : (
        <div role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">This invitation link is missing its token.</div>
      )}
      <div className="mt-5 flex items-center justify-center gap-1 text-xs text-slate-500">
        Not the invited account? <SignOutButton />
      </div>
    </div>
  );
}
