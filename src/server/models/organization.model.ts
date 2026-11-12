import { model, models, Schema, type InferSchemaType } from "mongoose";

const organizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 48,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    description: { type: String, default: "", maxlength: 500 },
    logo: { type: String, default: "" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: String, enum: ["free"], default: "free", required: true },
    isActive: { type: Boolean, default: true, index: true },
    adminCount: { type: Number, required: true, default: 1, min: 1 },
  },
  { timestamps: true },
);

export type OrganizationDocument = InferSchemaType<typeof organizationSchema>;

const Organization = models.Organization ?? model("Organization", organizationSchema);

export default Organization;
