import { z } from "zod";
import { requestApi } from "@/features/auth/model/auth-api.model";

export const onboardingSchema = z.object({
  name: z.string().trim().min(2, "Workspace name must be at least 2 characters").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Workspace URL must be at least 3 characters")
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().trim().max(500),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

export function slugifyOrganizationName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function createOrganizationRequest(values: OnboardingValues) {
  return requestApi<{ organization: { id: string; name: string; slug: string; role: string } }>(
    "/api/organizations",
    { body: values },
  );
}
