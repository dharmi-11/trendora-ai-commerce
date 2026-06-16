import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    userName: String,
    rating: Number,
    comment: String,
    date: String,
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    images: [String],
    tags: [String],
    styleKeywords: [String],
    colors: [String],
    sizes: [String],
    featured: Boolean,
    trendingScore: Number,
    salesCount: Number,
    shortNote: String,
    reviews: [ReviewSchema],
  },
  { timestamps: true },
);

export const ProductModel = models.Product || model("Product", ProductSchema);
