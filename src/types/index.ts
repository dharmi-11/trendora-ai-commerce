export type Category =
  | "Clothing"
  | "Footwear"
  | "Bags"
  | "Accessories"
  | "Beauty products";

export type UserRole = "user" | "admin";
export type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered";
export type PaymentMethod = "UPI" | "Card" | "Cash on Delivery";

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  discountPrice?: number;
  description: string;
  rating: number;
  stock: number;
  images: string[];
  tags: string[];
  styleKeywords: string[];
  colors: string[];
  sizes?: string[];
  featured?: boolean;
  trendingScore: number;
  salesCount: number;
  shortNote: string;
  reviews: Review[];
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  joinedAt: string;
  avatar: string;
  phone: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export interface SearchSuggestion {
  label: string;
  type: "product" | "category" | "style" | "budget";
  value: string;
}

export interface AnalyticsSummary {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}
