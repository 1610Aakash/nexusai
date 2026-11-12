"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  updateProfileRequest,
  type ProfileUser,
  type ProfileValues,
} from "../model/profile.model";

export function useProfileViewModel(user: ProfileUser) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, avatar: user.avatar },
  });

  const submit = form.handleSubmit(async (values) => {
    setMessage("");
    setError("");
    try {
      await updateProfileRequest(values);
      setMessage("Your profile has been updated.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update profile");
    }
  });

  return { form, submit, message, error, isSubmitting: form.formState.isSubmitting };
}
