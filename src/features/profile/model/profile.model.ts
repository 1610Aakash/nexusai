import { z } from "zod";
import { requestApi } from "@/features/auth/model/auth-api.model";

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
};

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  avatar: z.union([z.string().url("Enter a valid image URL").max(2048), z.literal("")]),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export function updateProfileRequest(values: ProfileValues) {
  return requestApi<{ user: ProfileUser }>("/api/users/me", {
    method: "PATCH",
    body: values,
  });
}
