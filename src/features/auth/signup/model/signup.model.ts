import { z } from "zod";
import { requestApi } from "../../model/auth-api.model";

export const signupPageContent = {
  heading: "Create your workspace",
  description: "Create your account, then set up your workspace.",
};

export const signupFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().email("Enter a valid email address").max(254),
    password: z
      .string()
      .min(12, "Use at least 12 characters")
      .max(128)
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((accepted) => accepted, "Please accept the terms to continue"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;

export function signupRequest(values: SignupFormValues) {
  return requestApi<{
    user: { id: string; name: string; email: string; isEmailVerified: boolean };
    emailDelivery: "smtp" | "development-preview" | "failed" | "disabled";
  }>("/api/auth/signup", {
    body: {
      name: values.name,
      email: values.email,
      password: values.password,
    },
  });
}
