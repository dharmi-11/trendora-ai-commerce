import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    userId: { type: String, required: true },
    permissions: [String],
  },
  { timestamps: true },
);

export const AdminModel = models.Admin || model("Admin", AdminSchema);
