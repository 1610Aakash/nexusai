"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordRequest,
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../model/forgot-password.model";

export function useForgotPasswordViewModel() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    setError("");
    try {
      await forgotPasswordRequest(values);
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit request");
    }
  });

  return { form, submit, submitted, error, isSubmitting: form.formState.isSubmitting };
}
