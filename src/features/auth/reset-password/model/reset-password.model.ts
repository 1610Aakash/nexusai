import { z } from "zod";
import { requestApi } from "../../model/auth-api.model";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, "Use at least 12 characters")
      .max(128)
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function resetPasswordRequest(token: string, password: string) {
  return requestApi<Record<string, never>>("/api/auth/reset-password", {
    body: { token, password },
  });
}
