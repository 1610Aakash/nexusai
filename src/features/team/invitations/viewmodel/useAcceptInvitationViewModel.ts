"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptInvitationRequest } from "../model/invitations.model";

export function useAcceptInvitationViewModel(token: string) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const accept = async () => {
    setBusy(true);
    setError("");
    try {
      await acceptInvitationRequest(token);
      router.replace("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to accept invitation");
    } finally {
      setBusy(false);
    }
  };

  return { accept, error, busy };
}
