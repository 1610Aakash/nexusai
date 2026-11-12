import { model, models, Schema, type InferSchemaType } from "mongoose";

const membershipSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "agent"], required: true },
    status: { type: String, enum: ["active", "suspended", "removed"], default: "active", required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

membershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
membershipSchema.index({ userId: 1, status: 1 });
membershipSchema.index({ organizationId: 1, status: 1, role: 1 });

export type MembershipDocument = InferSchemaType<typeof membershipSchema>;

const Membership = models.Membership ?? model("Membership", membershipSchema);

export default Membership;
