"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordRequest,
  resetPasswordSchema,
  type ResetPasswordValues,
} from "../model/reset-password.model";

export function useResetPasswordViewModel(token: string) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    setError("");
    try {
      await resetPasswordRequest(token, values.password);
      setSuccess(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset password");
    }
  });

  const returnToLogin = () => router.replace("/login");

  return { form, submit, error, success, returnToLogin, isSubmitting: form.formState.isSubmitting };
}
