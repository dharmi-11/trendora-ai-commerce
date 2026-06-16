import { Schema, model, models } from "mongoose";

const WishlistSchema = new Schema(
  {
    userId: { type: String, required: true },
    productIds: [String],
  },
  { timestamps: true },
);

export const WishlistModel = models.Wishlist || model("Wishlist", WishlistSchema);
