"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  resendVerificationRequest,
  verifyEmailRequest,
} from "../model/verify-email.model";

const resendSchema = z.object({ email: z.string().trim().email("Enter a valid email address") });
type ResendValues = z.infer<typeof resendSchema>;

export function useVerifyEmailViewModel(token: string, initialEmail: string) {
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">("idle");
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const started = useRef(false);
  const form = useForm<ResendValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: initialEmail },
  });

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    setStatus("verifying");
    verifyEmailRequest(token)
      .then(() => setStatus("verified"))
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "Unable to verify this email");
        setStatus("error");
      });
  }, [token]);

  const resend = form.handleSubmit(async ({ email }) => {
    setError("");
    setResendMessage("");
    try {
      await resendVerificationRequest(email);
      setResendMessage("If the account needs verification, a message will be sent.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request a verification email");
    }
  });

  return { status, error, form, resend, resendMessage, isResending: form.formState.isSubmitting };
}
