import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((email) => email.toLowerCase());

export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password must be no more than 128 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
  termsAccepted: z.literal(true).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const emailOnlySchema = z.object({ email: emailSchema });

export const verifyEmailSchema = z.object({
  token: z.string().min(32).max(256),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32).max(256),
  password: passwordSchema,
});

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    avatar: z.union([z.string().url().max(2048), z.literal("")]).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "Provide at least one profile field");

export const organizationCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens"),
  description: z.string().trim().max(500).optional().default(""),
});

export const organizationUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    description: z.string().trim().max(500).optional(),
    logo: z.union([z.string().url().max(2048), z.literal("")]).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0);

export const organizationSwitchSchema = z.object({
  organizationId: z.string().regex(/^[a-f\d]{24}$/i),
});

export const inviteSchema = z.object({
  email: emailSchema,
  role: z.enum(["admin", "agent"]),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(32).max(256),
});

export const memberUpdateSchema = z.object({
  role: z.enum(["admin", "agent"]).optional(),
  status: z.enum(["active", "suspended"]).optional(),
}).strict().refine((value) => Object.keys(value).length > 0);
