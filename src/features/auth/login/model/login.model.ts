import { z } from "zod";
import { requestApi } from "../../model/auth-api.model";

export const loginPageContent = {
  heading: "Sign in to NexusAI",
  description:
    "Authentication is not enabled in this foundation release. Sign-in workflows will be added in a later part.",
};

export const loginFormSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export function loginRequest(values: LoginFormValues) {
  return requestApi<{ user: { id: string; name: string; email: string } }>("/api/auth/login", {
    body: values,
  });
}
