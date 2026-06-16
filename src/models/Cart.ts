import { Schema, model, models } from "mongoose";

const CartItemSchema = new Schema(
  {
    productId: String,
    quantity: Number,
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    userId: { type: String, required: true },
    items: [CartItemSchema],
  },
  { timestamps: true },
);

export const CartModel = models.Cart || model("Cart", CartSchema);
