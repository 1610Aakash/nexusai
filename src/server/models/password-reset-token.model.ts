import { model, models, Schema, type InferSchemaType } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordResetTokenDocument = InferSchemaType<typeof passwordResetTokenSchema>;

const PasswordResetToken =
  models.PasswordResetToken ?? model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;
