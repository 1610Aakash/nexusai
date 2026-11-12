import nodemailer, { type Transporter } from "nodemailer";
import { ApiError } from "@/server/http/api-response";

type MailRequest = {
  to: string;
  subject: string;
  text: string;
};

export type MailDelivery = "smtp" | "development-preview" | "failed";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST && !SMTP_PORT && !SMTP_USER && !SMTP_PASSWORD) return null;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new ApiError(503, "Email delivery is not fully configured");
  }
  const port = Number(SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new ApiError(503, "SMTP_PORT must be a valid port number");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
  }

  return transporter;
}

export function assertEmailDeliveryAvailable(): void {
  const mailer = getTransporter();
  if ((mailer && !process.env.SMTP_FROM) || (!mailer && process.env.SMTP_FROM)) {
    throw new ApiError(503, "Email delivery is not fully configured");
  }
  if (!mailer && process.env.NODE_ENV === "production") {
    throw new ApiError(503, "Email delivery must be configured before this action");
  }
}

export async function sendEmail(request: MailRequest): Promise<MailDelivery> {
  const mailer = getTransporter();
  const from = process.env.SMTP_FROM;

  if (mailer && from) {
    await mailer.sendMail({ from, ...request });
    return "smtp";
  }

  if (mailer || from) {
    throw new ApiError(503, "Email delivery is not fully configured");
  }

  if (process.env.NODE_ENV === "production") {
    throw new ApiError(503, "Email delivery must be configured before this action");
  }

  console.info("NexusAI development email preview", {
    to: request.to,
    subject: request.subject,
    content: request.text,
  });
  return "development-preview";
}

function appUrl(path: string): string {
  const origin = new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").origin;
  return new URL(path, origin).toString();
}

export function sendVerificationEmail(to: string, token: string): Promise<MailDelivery> {
  const link = appUrl(`/verify-email?token=${encodeURIComponent(token)}`);
  return sendEmail({
    to,
    subject: "Verify your NexusAI email",
    text: `Verify your email address by opening this link: ${link}\n\nThis link expires in 24 hours.`,
  });
}

export function sendPasswordResetEmail(to: string, token: string): Promise<MailDelivery> {
  const link = appUrl(`/reset-password?token=${encodeURIComponent(token)}`);
  return sendEmail({
    to,
    subject: "Reset your NexusAI password",
    text: `Reset your password by opening this link: ${link}\n\nThis link expires in 1 hour.`,
  });
}

export function sendInvitationEmail(
  to: string,
  token: string,
  organizationName: string,
): Promise<MailDelivery> {
  const link = appUrl(`/invitations/accept?token=${encodeURIComponent(token)}`);
  return sendEmail({
    to,
    subject: `Invitation to join ${organizationName} on NexusAI`,
    text: `You have been invited to join ${organizationName} on NexusAI. Accept the invitation here: ${link}\n\nThis link expires in 7 days.`,
  });
}
