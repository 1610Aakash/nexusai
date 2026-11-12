import { z } from "zod";
import { requestApi } from "../../model/auth-api.model";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function forgotPasswordRequest(values: ForgotPasswordValues) {
  return requestApi<Record<string, never>>("/api/auth/forgot-password", { body: values });
}
