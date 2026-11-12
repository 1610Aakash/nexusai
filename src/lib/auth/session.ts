import { cookies } from "next/headers";
import { Types } from "mongoose";
import { hasPermission } from "./permissions";
import { ApiError } from "@/server/http/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import Membership from "@/server/models/membership.model";
import Organization from "@/server/models/organization.model";
import User from "@/server/models/user.model";
import { signSession, verifySession } from "./jwt";

export const SESSION_COOKIE = "nexusai_session";
export const ACTIVE_ORGANIZATION_COOKIE = "nexusai_active_org";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
};

export type OrganizationContext = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  ownerId: string;
  membershipId: string;
  role: "admin" | "agent";
  status: "active";
};

function toSafeUser(user: {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar: string;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
}): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt: user.lastLoginAt,
  };
}

export async function createSession(userId: string, tokenVersion: number): Promise<string> {
  return signSession(userId, tokenVersion);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  let session;
  try {
    session = await verifySession(token);
  } catch {
    return null;
  }

  await connectToDatabase();
  const user = await User.findById(session.sub)
    .select("+tokenVersion")
    .lean()
    .exec();

  if (
    !user ||
    !user.isActive ||
    (user.tokenVersion ?? 0) !== session.ver
  ) {
    return null;
  }

  return toSafeUser(user);
}

export async function getCurrentOrganization(
  userId?: string,
): Promise<OrganizationContext | null> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (!user) return null;

  await connectToDatabase();
  const cookieStore = await cookies();
  const requestedOrganizationId = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value;
  if (requestedOrganizationId && !Types.ObjectId.isValid(requestedOrganizationId)) {
    return null;
  }

  const membershipQuery = Membership.findOne({
    userId: user.id,
    status: "active",
    ...(requestedOrganizationId ? { organizationId: requestedOrganizationId } : {}),
  })
    .sort({ createdAt: 1 })
    .lean();
  let membership = await membershipQuery.exec();
  if (!membership && requestedOrganizationId) {
    membership = await Membership.findOne({ userId: user.id, status: "active" })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
  }

  if (!membership) return null;

  const organization = await Organization.findOne({
    _id: membership.organizationId,
    isActive: true,
  })
    .lean()
    .exec();

  if (!organization) return null;

  return {
    id: organization._id.toString(),
    name: organization.name,
    slug: organization.slug,
    description: organization.description,
    logo: organization.logo,
    ownerId: organization.ownerId.toString(),
    membershipId: membership._id.toString(),
    role: membership.role,
    status: "active",
  };
}

export async function requireAuthenticatedUser(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApiError(401, "Authentication required");
  }
  return user;
}

export async function requireOrganizationMembership(): Promise<{
  user: SafeUser;
  organization: OrganizationContext;
}> {
  const user = await requireAuthenticatedUser();
  const organization = await getCurrentOrganization(user.id);
  if (!organization) {
    throw new ApiError(403, "An active organization membership is required");
  }
  return { user, organization };
}

export async function requireOrganizationAdmin(): Promise<{
  user: SafeUser;
  organization: OrganizationContext;
}> {
  const context = await requireOrganizationMembership();
  if (!hasPermission(context.organization.role, "members:invite")) {
    throw new ApiError(403, "Organization administrator permission required");
  }
  return context;
}
