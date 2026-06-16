"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency } from "@/lib/utils";
import { useTrendoraStore } from "@/store/trendora-store";

export function CartPage() {
  const products = useTrendoraStore((state) => state.products);
  const cart = useTrendoraStore((state) => state.cart);
  const updateQuantity = useTrendoraStore((state) => state.updateQuantity);
  const removeFromCart = useTrendoraStore((state) => state.removeFromCart);

  const cartProducts = cart
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as { item: { productId: string; quantity: number }; product: (typeof products)[number] }[];

  const subtotal = cartProducts.reduce(
    (sum, entry) => sum + (entry.product.discountPrice ?? entry.product.price) * entry.item.quantity,
    0,
  );
  const shipping = subtotal >= 2500 ? 0 : 99;
  const total = subtotal + shipping;

  if (!cartProducts.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <EmptyState
          title="Your cart is waiting for a great pick"
          description="Add a few Trendora favorites to unlock checkout, AI suggestions, and your order summary."
          actionLabel="Continue Shopping"
          href="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="space-y-4">
        {cartProducts.map(({ item, product }) => (
          <div key={product.id} className="surface rounded-[2rem] border p-6 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{product.category}</p>
                <h2 className="mt-2 font-display text-3xl font-semibold">{product.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{formatCurrency(product.discountPrice ?? product.price)} each</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 rounded-full border px-3 py-2">
                  <button type="button" onClick={() => updateQuantity(product.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(product.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="min-w-28 text-right font-semibold">
                  {formatCurrency((product.discountPrice ?? product.price) * item.quantity)}
                </p>
                <button type="button" onClick={() => removeFromCart(product.id)} className="rounded-full border p-3 text-slate-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="surface h-fit rounded-[2rem] border p-6 shadow-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Order Summary</p>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span></div>
          <div className="flex justify-between border-t pt-4 text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
        </div>
        <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-accent px-5 py-4 text-sm font-semibold text-white">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
