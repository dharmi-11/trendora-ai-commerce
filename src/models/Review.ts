import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: { type: String, required: true },
    userName: String,
    rating: Number,
    comment: String,
    date: String,
  },
  { timestamps: true },
);

export const ReviewModel = models.Review || model("Review", ReviewSchema);
