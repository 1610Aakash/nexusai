"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupFormSchema,
  signupRequest,
  type SignupFormValues,
} from "../model/signup.model";

export function useSignupViewModel() {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setError("");
    try {
      await signupRequest(values);
      router.replace("/onboarding");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create account");
    }
  });

  return { form, submit, error, isSubmitting: form.formState.isSubmitting };
}
