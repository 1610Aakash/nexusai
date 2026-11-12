import { model, models, Schema, type InferSchemaType } from "mongoose";

const verificationTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type VerificationTokenDocument = InferSchemaType<typeof verificationTokenSchema>;

const VerificationToken =
  models.VerificationToken ?? model("VerificationToken", verificationTokenSchema);

export default VerificationToken;
