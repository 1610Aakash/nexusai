import { model, models, Schema, type InferSchemaType } from "mongoose";

const invitationSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    role: { type: String, enum: ["admin", "agent"], required: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    status: { type: String, enum: ["pending", "accepted", "expired", "revoked"], default: "pending", required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

invitationSchema.index(
  { organizationId: 1, email: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);
invitationSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type InvitationDocument = InferSchemaType<typeof invitationSchema>;

const Invitation = models.Invitation ?? model("Invitation", invitationSchema);

export default Invitation;
