import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: String,
    quantity: Number,
    price: Number,
  },
  { _id: false },
);

const AddressSchema = new Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    zipCode: String,
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    status: { type: String, default: "Processing" },
    paymentMethod: String,
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,
    subtotal: Number,
    shippingFee: Number,
    discount: Number,
    total: Number,
  },
  { timestamps: true },
);

export const OrderModel = models.Order || model("Order", OrderSchema);
