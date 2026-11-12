import { Types } from "mongoose";
import { ApiError } from "@/server/http/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { isEmailVerificationRequired } from "@/lib/auth/email-verification";
import AuditLog from "@/server/models/audit-log.model";
import Invitation from "@/server/models/invitation.model";
import Membership from "@/server/models/membership.model";
import Organization from "@/server/models/organization.model";
import User from "@/server/models/user.model";
import {
  addDays,
  createOpaqueToken,
  hashOpaqueToken,
} from "./security.service";
import { withMongoTransaction } from "./mongo.service";
import { sendInvitationEmail, assertEmailDeliveryAvailable } from "./email.service";

export type OrganizationListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  ownerId: string;
  role: "admin" | "agent" | undefined;
};

export async function createOrganization(
  userId: string,
  input: { name: string; slug: string; description: string },
) {
  await connectToDatabase();
  const user = await User.findById(userId).select("isEmailVerified").lean().exec();
  if (isEmailVerificationRequired() && !user?.isEmailVerified) {
    throw new ApiError(403, "Verify your email before creating an organization");
  }

  try {
    return await withMongoTransaction(async (session) => {
      const options = session ? { session } : undefined;
      const organizations = await Organization.create(
        [{ ...input, ownerId: new Types.ObjectId(userId) }],
        options,
      );
      const organization = organizations[0];
      try {
        await Membership.create(
          [
            {
              organizationId: organization._id,
              userId: new Types.ObjectId(userId),
              role: "admin",
              status: "active",
            },
          ],
          options,
        );
      } catch (error) {
        if (!session) await Organization.deleteOne({ _id: organization._id }).exec();
        throw error;
      }
      return organization;
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new ApiError(409, "That workspace URL is already in use");
    }
    throw error;
  }
}

export async function listOrganizations(userId: string) {
  await connectToDatabase();
  const memberships = await Membership.find({ userId, status: "active" })
    .sort({ createdAt: 1 })
    .lean()
    .exec();
  const organizationIds = memberships.map((membership) => membership.organizationId);
  const organizations = await Organization.find({
    _id: { $in: organizationIds },
    isActive: true,
  })
    .select("name slug description logo ownerId")
    .lean()
    .exec();
  const membershipByOrganization = new Map(
    memberships.map((membership) => [membership.organizationId.toString(), membership]),
  );

  return organizations.map((organization) => {
    const membership = membershipByOrganization.get(organization._id.toString());
    return {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      logo: organization.logo,
      ownerId: organization.ownerId.toString(),
      role: membership?.role,
    } satisfies OrganizationListItem;
  });
}

export async function getOrganizationForUser(userId: string, organizationId: string) {
  await connectToDatabase();
  const membership = await Membership.findOne({
    organizationId,
    userId,
    status: "active",
  })
    .lean()
    .exec();
  if (!membership) throw new ApiError(404, "Organization not found");

  const organization = await Organization.findOne({ _id: organizationId, isActive: true })
    .select("name slug description logo ownerId plan")
    .lean()
    .exec();
  if (!organization) throw new ApiError(404, "Organization not found");
  return { organization, membership };
}

export async function updateCurrentOrganization(
  organizationId: string,
  input: { name?: string; description?: string; logo?: string },
) {
  await connectToDatabase();
  const organization = await Organization.findOneAndUpdate(
    { _id: organizationId, isActive: true },
    { $set: input },
    { returnDocument: "after", runValidators: true },
  )
    .select("name slug description logo ownerId plan")
    .lean()
    .exec();
  if (!organization) throw new ApiError(404, "Organization not found");
  return organization;
}

export async function switchOrganization(userId: string, organizationId: string) {
  const { organization, membership } = await getOrganizationForUser(userId, organizationId);
  if (membership.status !== "active") throw new ApiError(403, "Active membership required");
  return {
    id: organization._id.toString(),
    name: organization.name,
    slug: organization.slug,
    role: membership.role,
  };
}

export async function listMembers(organizationId: string) {
  await connectToDatabase();
  const memberships = await Membership.find({ organizationId, status: { $ne: "removed" } })
    .sort({ createdAt: 1 })
    .lean()
    .exec();
  const users = await User.find({ _id: { $in: memberships.map((membership) => membership.userId) } })
    .select("name email avatar")
    .lean()
    .exec();
  const usersById = new Map(users.map((user) => [user._id.toString(), user]));

  return memberships.flatMap((membership) => {
    const user = usersById.get(membership.userId.toString());
    if (!user) return [];
    return [
      {
        id: membership._id.toString(),
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joinedAt,
      },
    ];
  });
}

export async function listInvitations(organizationId: string) {
  await connectToDatabase();
  await Invitation.updateMany(
    { organizationId, status: "pending", expiresAt: { $lte: new Date() } },
    { $set: { status: "expired" } },
  ).exec();
  const invitations = await Invitation.find({ organizationId, status: "pending" })
    .sort({ createdAt: -1 })
    .select("-tokenHash")
    .lean()
    .exec();
  return invitations.map((invitation) => ({
    id: invitation._id.toString(),
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
  }));
}

export async function createInvitation(
  organizationId: string,
  actorId: string,
  input: { email: string; role: "admin" | "agent" },
) {
  await connectToDatabase();
  assertEmailDeliveryAvailable();
  await Invitation.updateMany(
    { organizationId, email: input.email, status: "pending", expiresAt: { $lte: new Date() } },
    { $set: { status: "expired" } },
  ).exec();
  const [organization, existingUser] = await Promise.all([
    Organization.findOne({ _id: organizationId, isActive: true }).lean().exec(),
    User.findOne({ email: input.email }).select("_id").lean().exec(),
  ]);
  if (!organization) throw new ApiError(404, "Organization not found");

  if (
    existingUser &&
    (await Membership.exists({
      organizationId,
      userId: existingUser._id,
      status: { $ne: "removed" },
    }))
  ) {
    throw new ApiError(409, "This user is already a member of the organization");
  }

  const token = createOpaqueToken();
  const invitation = await Invitation.create({
    organizationId,
    invitedBy: actorId,
    email: input.email,
    role: input.role,
    tokenHash: hashOpaqueToken(token),
    expiresAt: addDays(new Date(), 7),
  });

  try {
    await sendInvitationEmail(input.email, token, organization.name);
  } catch (error) {
    await Invitation.findByIdAndUpdate(invitation._id, { $set: { status: "revoked" } }).exec();
    console.error("Invitation email delivery failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    throw new ApiError(503, "Invitation email could not be delivered");
  }

  await AuditLog.create({
    organizationId,
    actorId,
    action: "invitation.created",
    targetId: invitation._id,
    metadata: { email: input.email, role: input.role },
  });

  return {
    id: invitation._id.toString(),
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
  };
}

export async function acceptInvitation(userId: string, email: string, token: string) {
  await connectToDatabase();
  const user = await User.findById(userId).select("isEmailVerified").lean().exec();
  if (isEmailVerificationRequired() && !user?.isEmailVerified) {
    throw new ApiError(403, "Verify your email before accepting invitations");
  }

  const now = new Date();
  const invitation = await Invitation.findOneAndUpdate(
    {
      tokenHash: hashOpaqueToken(token),
      status: "pending",
      expiresAt: { $gt: now },
      email,
    },
    { $set: { status: "accepted", acceptedAt: now } },
    { returnDocument: "after" },
  ).exec();

  if (!invitation) {
    const tokenMatch = await Invitation.findOne({
      tokenHash: hashOpaqueToken(token),
      status: "pending",
      expiresAt: { $gt: now },
    })
      .select("email")
      .lean()
      .exec();
    if (tokenMatch && tokenMatch.email !== email) {
      throw new ApiError(403, "Sign in with the email address this invitation was sent to");
    }
    throw new ApiError(400, "Invitation is invalid, expired, or already used");
  }

  try {
    await withMongoTransaction(async (session) => {
      const existing = await Membership.findOne({
        organizationId: invitation.organizationId,
        userId,
      }).session(session);
      if (existing && existing.status !== "removed") {
        throw new ApiError(409, "You are already a member of this organization");
      }

      const previous = existing
        ? { role: existing.role, status: existing.status, joinedAt: existing.joinedAt }
        : null;
      try {
        if (existing) {
          existing.role = invitation.role;
          existing.status = "active";
          existing.joinedAt = now;
          await existing.save(session ? { session } : undefined);
        } else {
          await Membership.create(
            [{
              organizationId: invitation.organizationId,
              userId,
              role: invitation.role,
              status: "active",
              joinedAt: now,
            }],
            session ? { session } : undefined,
          );
        }
        if (invitation.role === "admin") {
          const result = await Organization.updateOne(
            { _id: invitation.organizationId },
            { $inc: { adminCount: 1 } },
            session ? { session } : undefined,
          ).exec();
          if (result.matchedCount !== 1) throw new ApiError(404, "Organization not found");
        }
      } catch (error) {
        if (!session) {
          if (existing && previous) {
            existing.role = previous.role;
            existing.status = previous.status;
            existing.joinedAt = previous.joinedAt;
            await existing.save();
          } else if (!existing) {
            await Membership.deleteOne({
              organizationId: invitation.organizationId,
              userId,
              status: "active",
            }).exec();
          }
          if (invitation.role === "admin") {
            await Organization.updateOne(
              { _id: invitation.organizationId, adminCount: { $gt: 1 } },
              { $inc: { adminCount: -1 } },
            ).exec();
          }
        }
        throw error;
      }
    });
  } catch (error) {
    await Invitation.findByIdAndUpdate(invitation._id, { $set: { status: "pending", acceptedAt: null } }).exec();
    throw error;
  }

  await AuditLog.create({
    organizationId: invitation.organizationId,
    actorId: userId,
    action: "invitation.accepted",
    targetId: invitation._id,
  });
  return invitation.organizationId.toString();
}

export async function revokeInvitation(organizationId: string, actorId: string, invitationId: string) {
  await connectToDatabase();
  const invitation = await Invitation.findOneAndUpdate(
    { _id: invitationId, organizationId, status: "pending" },
    { $set: { status: "revoked" } },
    { returnDocument: "after" },
  ).exec();
  if (!invitation) throw new ApiError(404, "Pending invitation not found");
  await AuditLog.create({
    organizationId,
    actorId,
    action: "invitation.revoked",
    targetId: invitation._id,
  });
}

export async function updateMember(
  organizationId: string,
  actorId: string,
  memberId: string,
  input: { role?: "admin" | "agent"; status?: "active" | "suspended" },
) {
  await connectToDatabase();
  const membership = await Membership.findOne({
    _id: memberId,
    organizationId,
    status: { $ne: "removed" },
  }).exec();
  if (!membership) throw new ApiError(404, "Organization member not found");

  const organization = await Organization.findById(organizationId).select("ownerId").lean().exec();
  if (!organization) throw new ApiError(404, "Organization not found");
  if (organization.ownerId.toString() === membership.userId.toString()) {
    throw new ApiError(403, "The organization owner cannot be modified or removed");
  }

  const nextRole = input.role ?? membership.role;
  const nextStatus = input.status ?? membership.status;
  const previousRole = membership.role;
  const previousStatus = membership.status;
  const wasAdmin = membership.role === "admin" && membership.status === "active";
  const willBeAdmin = nextRole === "admin" && nextStatus === "active";

  await withMongoTransaction(async (session) => {
    if (wasAdmin && !willBeAdmin) {
      if (session) {
        const result = await Organization.updateOne(
          { _id: organizationId, adminCount: { $gt: 1 } },
          { $inc: { adminCount: -1 } },
          { session },
        ).exec();
        if (result.modifiedCount !== 1) {
          throw new ApiError(409, "The organization must have at least one active administrator");
        }
      } else {
        const result = await Membership.updateOne(
          { _id: membership._id, role: "admin", status: "active" },
          { $set: { role: nextRole, status: nextStatus } },
        ).exec();
        if (result.modifiedCount !== 1) throw new ApiError(409, "Member changed; refresh and try again");
        const countResult = await Organization.updateOne(
          { _id: organizationId, adminCount: { $gt: 1 } },
          { $inc: { adminCount: -1 } },
        ).exec();
        if (countResult.modifiedCount !== 1) {
          await Membership.updateOne(
            { _id: membership._id, role: nextRole, status: nextStatus },
            { $set: { role: previousRole, status: previousStatus } },
          ).exec();
          throw new ApiError(409, "The organization must have at least one active administrator");
        }
        membership.role = nextRole;
        membership.status = nextStatus;
      }
    } else if (!wasAdmin && willBeAdmin) {
      const increment = await Organization.updateOne(
        { _id: organizationId },
        { $inc: { adminCount: 1 } },
        session ? { session } : undefined,
      ).exec();
      if (increment.matchedCount !== 1) throw new ApiError(404, "Organization not found");
    }

    if (session || !(wasAdmin && !willBeAdmin)) {
      membership.role = nextRole;
      membership.status = nextStatus;
      try {
        await membership.save(session ? { session } : undefined);
      } catch (error) {
        if (!session && !wasAdmin && willBeAdmin) {
          membership.role = previousRole;
          membership.status = previousStatus;
          await Organization.updateOne(
            { _id: organizationId, adminCount: { $gt: 1 } },
            { $inc: { adminCount: -1 } },
          ).exec();
        }
        throw error;
      }
    }
    await AuditLog.create(
      [{
        organizationId,
        actorId,
        action: "member.updated",
        targetId: membership._id,
        metadata: { role: nextRole, status: nextStatus },
      }],
      session ? { session } : undefined,
    );
  });

  return {
    id: membership._id.toString(),
    role: membership.role,
    status: membership.status,
  };
}

export async function removeMember(
  organizationId: string,
  actorId: string,
  memberId: string,
) {
  await connectToDatabase();
  const membership = await Membership.findOne({
    _id: memberId,
    organizationId,
    status: { $ne: "removed" },
  }).exec();
  if (!membership) throw new ApiError(404, "Organization member not found");

  const organization = await Organization.findById(organizationId).select("ownerId").lean().exec();
  if (!organization) throw new ApiError(404, "Organization not found");
  if (organization.ownerId.toString() === membership.userId.toString()) {
    throw new ApiError(403, "The organization owner cannot be removed");
  }

  await withMongoTransaction(async (session) => {
    if (membership.role === "admin" && membership.status === "active") {
      if (session) {
        const result = await Organization.updateOne(
          { _id: organizationId, adminCount: { $gt: 1 } },
          { $inc: { adminCount: -1 } },
          { session },
        ).exec();
        if (result.modifiedCount !== 1) {
          throw new ApiError(409, "The last active administrator cannot be removed");
        }
      } else {
        const result = await Membership.updateOne(
          { _id: membership._id, role: "admin", status: "active" },
          { $set: { status: "removed" } },
        ).exec();
        if (result.modifiedCount !== 1) throw new ApiError(409, "Member changed; refresh and try again");
        const countResult = await Organization.updateOne(
          { _id: organizationId, adminCount: { $gt: 1 } },
          { $inc: { adminCount: -1 } },
        ).exec();
        if (countResult.modifiedCount !== 1) {
          await Membership.updateOne(
            { _id: membership._id, status: "removed" },
            { $set: { status: "active" } },
          ).exec();
          throw new ApiError(409, "The last active administrator cannot be removed");
        }
      }
    }
    if (session || (membership.role !== "admin" || membership.status !== "active")) {
      membership.status = "removed";
      await membership.save(session ? { session } : undefined);
    }
    await AuditLog.create(
      [{ organizationId, actorId, action: "member.removed", targetId: membership._id }],
      session ? { session } : undefined,
    );
  });
}
