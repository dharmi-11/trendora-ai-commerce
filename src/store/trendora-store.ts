"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createId } from "@/lib/utils";
import { demoOrders, demoProducts, demoUsers } from "@/lib/demo-data";
import type { Address, CartItem, Order, PaymentMethod, Product, Review, User } from "@/types";

interface TrendoraStore {
  products: Product[];
  users: User[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  currentUserId: string | null;
  lastCheckoutId: string | null;
  signUp: (payload: { name: string; email: string; password: string; phone: string }) => { ok: boolean; message: string };
  signIn: (payload: { email: string; password: string }) => { ok: boolean; message: string; role?: string };
  signOut: () => void;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  markViewed: (productId: string) => void;
  placeOrder: (payload: { address: Address; paymentMethod: PaymentMethod }) => { ok: boolean; orderId?: string; message: string };
  addReview: (productId: string, review: Omit<Review, "id" | "date">) => void;
  addProduct: (product: Omit<Product, "id" | "slug" | "reviews"> & { slug?: string }) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
}

export const useTrendoraStore = create<TrendoraStore>()(
  persist(
    (set, get) => ({
      products: demoProducts,
      users: demoUsers,
      orders: demoOrders,
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      currentUserId: null,
      lastCheckoutId: null,
      signUp: ({ name, email, password, phone }) => {
        const exists = get().users.some((user) => user.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { ok: false, message: "An account with this email already exists." };
        }

        const newUser: User = {
          id: createId("user"),
          name,
          email,
          password,
          role: "user",
          joinedAt: new Date().toISOString().slice(0, 10),
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
          phone,
        };

        set((state) => ({
          users: [...state.users, newUser],
          currentUserId: newUser.id,
        }));

        return { ok: true, message: "Account created successfully." };
      },
      signIn: ({ email, password }) => {
        const user = get().users.find(
          (candidate) =>
            candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password,
        );

        if (!user) {
          return { ok: false, message: "Invalid email or password." };
        }

        set({ currentUserId: user.id });

        return { ok: true, message: "Logged in successfully.", role: user.role };
      },
      signOut: () => set({ currentUserId: null, cart: [], wishlist: [], recentlyViewed: [] }),
      addToCart: (productId) =>
        set((state) => {
          const exists = state.cart.find((item) => item.productId === productId);
          return {
            cart: exists
              ? state.cart.map((item) =>
                  item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
                )
              : [...state.cart, { productId, quantity: 1 }],
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item) => item.productId !== productId)
              : state.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        })),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        })),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      clearCart: () => set({ cart: [] }),
      markViewed: (productId) =>
        set((state) => ({
          recentlyViewed: [productId, ...state.recentlyViewed.filter((id) => id !== productId)].slice(0, 8),
        })),
      placeOrder: ({ address, paymentMethod }) => {
        const state = get();

        if (!state.currentUserId) {
          return { ok: false, message: "Please log in before checkout." };
        }

        if (!state.cart.length) {
          return { ok: false, message: "Your cart is empty." };
        }

        const cartProducts = state.cart
          .map((item) => {
            const product = state.products.find((candidate) => candidate.id === item.productId);
            return product ? { item, product } : null;
          })
          .filter(Boolean) as { item: CartItem; product: Product }[];

        const subtotal = cartProducts.reduce(
          (total, entry) => total + (entry.product.discountPrice ?? entry.product.price) * entry.item.quantity,
          0,
        );
        const shippingFee = subtotal >= 2500 ? 0 : 99;
        const discount = subtotal >= 4000 ? 300 : subtotal >= 2500 ? 150 : 0;
        const total = subtotal + shippingFee - discount;

        const orderId = createId("order");
        const newOrder: Order = {
          id: orderId,
          userId: state.currentUserId,
          createdAt: new Date().toISOString().slice(0, 10),
          status: "Processing",
          paymentMethod,
          items: cartProducts.map(({ item, product }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: product.discountPrice ?? product.price,
          })),
          shippingAddress: address,
          subtotal,
          shippingFee,
          discount,
          total,
        };

        set((currentState) => ({
          orders: [newOrder, ...currentState.orders],
          cart: [],
          lastCheckoutId: orderId,
          products: currentState.products.map((product) => {
            const orderedItem = cartProducts.find(({ item }) => item.productId === product.id);
            return orderedItem
              ? {
                  ...product,
                  stock: Math.max(0, product.stock - orderedItem.item.quantity),
                  salesCount: product.salesCount + orderedItem.item.quantity,
                }
              : product;
          }),
        }));

        return { ok: true, orderId, message: "Order placed successfully." };
      },
      addReview: (productId, review) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  reviews: [
                    {
                      id: createId("review"),
                      date: new Date().toISOString().slice(0, 10),
                      ...review,
                    },
                    ...product.reviews,
                  ],
                  rating:
                    [...product.reviews, { rating: review.rating } as Review].reduce(
                      (sum, item) => sum + item.rating,
                      0,
                    ) /
                    (product.reviews.length + 1),
                }
              : product,
          ),
        })),
      addProduct: (product) =>
        set((state) => ({
          products: [
            {
              ...product,
              id: createId("product"),
              slug: product.slug ?? product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              reviews: [],
            },
            ...state.products,
          ],
        })),
      updateProduct: (productId, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  ...updates,
                  slug: updates.slug ?? product.slug,
                }
              : product,
          ),
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== productId),
          cart: state.cart.filter((item) => item.productId !== productId),
          wishlist: state.wishlist.filter((id) => id !== productId),
        })),
    }),
    {
      name: "trendora-store",
      partialize: (state) => ({
        products: state.products,
        users: state.users,
        orders: state.orders,
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        currentUserId: state.currentUserId,
        lastCheckoutId: state.lastCheckoutId,
      }),
    },
  ),
);

export function useCurrentUser() {
  return useTrendoraStore((state) =>
    state.users.find((user) => user.id === state.currentUserId) ?? null,
  );
}
