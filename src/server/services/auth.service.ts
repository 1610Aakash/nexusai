import { Types } from "mongoose";
import { ApiError } from "@/server/http/api-response";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, type SafeUser } from "@/lib/auth/session";
import { isEmailVerificationRequired } from "@/lib/auth/email-verification";
import { connectToDatabase } from "@/lib/mongodb";
import PasswordResetToken from "@/server/models/password-reset-token.model";
import User from "@/server/models/user.model";
import VerificationToken from "@/server/models/verification-token.model";
import {
  addHours,
  createOpaqueToken,
  hashOpaqueToken,
} from "./security.service";
import {
  assertEmailDeliveryAvailable,
  sendPasswordResetEmail,
  sendVerificationEmail,
  type MailDelivery,
} from "./email.service";

type UserRecord = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar: string;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
};

export function toSafeUser(user: UserRecord): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt: user.lastLoginAt,
  };
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: SafeUser; token: string; emailDelivery: MailDelivery | "disabled" }> {
  const verificationRequired = isEmailVerificationRequired();
  if (verificationRequired) assertEmailDeliveryAvailable();
  await connectToDatabase();

  if (await User.exists({ email: input.email })) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    isEmailVerified: !verificationRequired,
    emailVerifiedAt: verificationRequired ? null : new Date(),
  });

  let emailDelivery: MailDelivery | "disabled" = "disabled";
  if (verificationRequired) {
    const verificationToken = createOpaqueToken();
    await VerificationToken.create({
      userId: user._id,
      tokenHash: hashOpaqueToken(verificationToken),
      expiresAt: addHours(new Date(), 24),
    });

    try {
      emailDelivery = await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      console.error("Verification email delivery failed", {
        errorType: error instanceof Error ? error.name : "UnknownError",
      });
      emailDelivery = "failed";
    }
  }

  const token = await createSession(user.id, user.tokenVersion ?? 0);
  return { user: toSafeUser(user), token, emailDelivery };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<{ user: SafeUser; token: string }> {
  await connectToDatabase();
  const user = await User.findOne({ email: input.email })
    .select("+passwordHash +tokenVersion")
    .exec();
  const passwordMatches = user
    ? await verifyPassword(input.password, user.passwordHash)
    : false;

  if (!user || !passwordMatches || !user.isActive) {
    throw new ApiError(401, "Email or password is incorrect");
  }

  if (isEmailVerificationRequired() && !user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before signing in");
  }

  const token = await createSession(user.id, user.tokenVersion ?? 0);

  user.lastLoginAt = new Date();
  await user.save();

  return { user: toSafeUser(user), token };
}

export async function verifyEmail(token: string): Promise<void> {
  await connectToDatabase();
  const now = new Date();
  const verificationToken = await VerificationToken.findOneAndUpdate(
    {
      tokenHash: hashOpaqueToken(token),
      usedAt: null,
      expiresAt: { $gt: now },
    },
    { $set: { usedAt: now } },
    { returnDocument: "after" },
  ).exec();

  if (!verificationToken) {
    throw new ApiError(400, "Verification link is invalid, expired, or already used");
  }

  const user = await User.findOneAndUpdate(
    { _id: verificationToken.userId, isEmailVerified: false },
    { $set: { isEmailVerified: true, emailVerifiedAt: now } },
    { returnDocument: "after" },
  ).exec();

  if (!user) {
    throw new ApiError(400, "Verification link is invalid, expired, or already used");
  }
}

export async function resendVerification(email: string): Promise<MailDelivery | null> {
  assertEmailDeliveryAvailable();
  await connectToDatabase();
  const user = await User.findOne({ email, isEmailVerified: false, isActive: true }).exec();
  if (!user) return null;

  const token = createOpaqueToken();
  await VerificationToken.updateMany(
    { userId: user._id, usedAt: null },
    { $set: { usedAt: new Date() } },
  ).exec();
  await VerificationToken.create({
    userId: user._id,
    tokenHash: hashOpaqueToken(token),
    expiresAt: addHours(new Date(), 24),
  });
  try {
    return await sendVerificationEmail(user.email, token);
  } catch (error) {
    console.error("Verification email delivery failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return null;
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await connectToDatabase();
  const user = await User.findOne({ email, isActive: true }).exec();
  if (!user) return;

  const token = createOpaqueToken();
  await PasswordResetToken.updateMany(
    { userId: user._id, usedAt: null },
    { $set: { usedAt: new Date() } },
  ).exec();
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashOpaqueToken(token),
    expiresAt: addHours(new Date(), 1),
  });

  try {
    await sendPasswordResetEmail(user.email, token);
  } catch (error) {
    console.error("Password-reset email delivery failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
  }
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await connectToDatabase();
  const now = new Date();
  const resetToken = await PasswordResetToken.findOneAndUpdate(
    {
      tokenHash: hashOpaqueToken(token),
      usedAt: null,
      expiresAt: { $gt: now },
    },
    { $set: { usedAt: now } },
    { returnDocument: "after" },
  ).exec();

  if (!resetToken) {
    throw new ApiError(400, "Reset link is invalid, expired, or already used");
  }

  const user = await User.findById(resetToken.userId).select("+tokenVersion").exec();
  if (!user || !user.isActive) {
    throw new ApiError(400, "Reset link is invalid, expired, or already used");
  }

  user.passwordHash = await hashPassword(password);
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();
}

export async function updateProfile(
  userId: string,
  input: { name?: string; avatar?: string },
): Promise<SafeUser> {
  await connectToDatabase();
  const user = await User.findOneAndUpdate(
    { _id: userId, isActive: true },
    { $set: input },
    { returnDocument: "after", runValidators: true },
  ).exec();
  if (!user) throw new ApiError(404, "Account not found");
  return toSafeUser(user);
}
