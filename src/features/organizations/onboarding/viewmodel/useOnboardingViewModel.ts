"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createOrganizationRequest,
  onboardingSchema,
  slugifyOrganizationName,
  type OnboardingValues,
} from "../model/onboarding.model";

export function useOnboardingViewModel() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const updateName = (name: string) => {
    form.setValue("name", name, { shouldValidate: form.formState.isSubmitted });
    if (!form.formState.dirtyFields.slug) {
      form.setValue("slug", slugifyOrganizationName(name), {
        shouldValidate: form.formState.isSubmitted,
      });
    }
  };

  const next = async () => {
    setError("");
    if (step === 1) {
      const valid = await form.trigger(["name", "slug", "description"]);
      if (!valid) return;
    }
    setStep((current) => Math.min(current + 1, 3));
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const create = form.handleSubmit(async (values) => {
    setError("");
    try {
      await createOrganizationRequest(values);
      router.replace("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create workspace");
    }
  });

  return {
    form,
    step,
    next,
    back,
    create,
    updateName,
    error,
    isSubmitting: form.formState.isSubmitting,
  };
}
