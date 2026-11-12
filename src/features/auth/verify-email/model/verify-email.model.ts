import { z } from "zod";
import { requestApi } from "../../model/auth-api.model";

const emailSchema = z.string().trim().email();

export async function verifyEmailRequest(token: string) {
  return requestApi<Record<string, never>>("/api/auth/verify-email", { body: { token } });
}

export async function resendVerificationRequest(email: string) {
  const parsedEmail = emailSchema.parse(email);
  return requestApi<Record<string, never>>("/api/auth/resend-verification", {
    body: { email: parsedEmail },
  });
}
