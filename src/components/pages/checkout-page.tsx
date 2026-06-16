"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { paymentOptions } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useCurrentUser, useTrendoraStore } from "@/store/trendora-store";

export function CheckoutPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const cart = useTrendoraStore((state) => state.cart);
  const products = useTrendoraStore((state) => state.products);
  const placeOrder = useTrendoraStore((state) => state.placeOrder);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentOptions)[number]>("UPI");
  const [form, setForm] = useState({
    fullName: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: currentUser?.phone ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const summary = cart
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as { item: { quantity: number }; product: (typeof products)[number] }[];

  const subtotal = summary.reduce((sum, entry) => sum + (entry.product.discountPrice ?? entry.product.price) * entry.item.quantity, 0);
  const shippingFee = subtotal >= 2500 ? 0 : 99;
  const discount = subtotal >= 4000 ? 300 : subtotal >= 2500 ? 150 : 0;
  const total = subtotal + shippingFee - discount;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = placeOrder({ address: form, paymentMethod });
    setMessage(result.message);

    if (result.ok) {
      window.setTimeout(() => {
        router.push("/profile");
      }, 1000);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px] lg:px-8">
      <form onSubmit={handleSubmit} className="surface rounded-[2rem] border p-6 shadow-soft md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Checkout</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Delivery and payment</h1>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ["fullName", "Full name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["city", "City"],
            ["state", "State"],
            ["zipCode", "Pincode"],
          ].map(([key, label]) => (
            <label key={key} className="grid gap-2 text-sm font-medium">
              {label}
              <input
                value={form[key as keyof typeof form]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="rounded-2xl border bg-white/70 px-4 py-3 outline-none ring-0 dark:bg-slate-900/70"
                required={key !== "line2"}
              />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Address line 1
            <input
              value={form.line1}
              onChange={(event) => setForm((current) => ({ ...current, line1: event.target.value }))}
              className="rounded-2xl border bg-white/70 px-4 py-3 outline-none dark:bg-slate-900/70"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Address line 2
            <input
              value={form.line2}
              onChange={(event) => setForm((current) => ({ ...current, line2: event.target.value }))}
              className="rounded-2xl border bg-white/70 px-4 py-3 outline-none dark:bg-slate-900/70"
            />
          </label>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold">Payment Option</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {paymentOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPaymentMethod(option)}
                className={`rounded-[1.5rem] border px-4 py-4 text-sm font-medium transition ${
                  paymentMethod === option ? "border-accent bg-accent text-white" : "bg-white/70 dark:bg-slate-900/70"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {message ? (
          <p className="mt-6 rounded-2xl border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-moss dark:text-emerald-200">
            {message}
          </p>
        ) : null}

        <button type="submit" className="mt-8 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white">
          Place Order
        </button>
      </form>

      <aside className="surface h-fit rounded-[2rem] border p-6 shadow-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Order Summary</p>
        <div className="mt-5 space-y-4">
          {summary.map(({ item, product }) => (
            <div key={product.id} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-slate-500">Qty {item.quantity}</p>
              </div>
              <span>{formatCurrency((product.discountPrice ?? product.price) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>
          <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
        </div>
      </aside>
    </div>
  );
}
