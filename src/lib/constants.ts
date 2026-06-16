import type { Category, PaymentMethod } from "@/types";

export const categories: Category[] = [
  "Clothing",
  "Footwear",
  "Bags",
  "Accessories",
  "Beauty products",
];

export const paymentOptions: PaymentMethod[] = ["UPI", "Card", "Cash on Delivery"];

export const heroHighlights = [
  "AI-assisted gifting and outfit suggestions",
  "Fast smart search with real-time suggestions",
  "Immersive, mobile-first fashion storefront",
];

export const offerCards = [
  {
    title: "Monsoon Edit",
    description: "Layer-ready looks, weatherproof bags, and comfort shoes curated for city days.",
    chip: "Flat 18% Off",
  },
  {
    title: "Beauty Weekend",
    description: "Skincare and glow kits with combo pricing for self-care gifting.",
    chip: "Buy 2 Save 12%",
  },
  {
    title: "Campus Creator Picks",
    description: "Statement pieces for presentations, fests, and everyday style confidence.",
    chip: "New Arrivals",
  },
];
