"use client";

import Link from "next/link";
import { format } from "date-fns";

import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { formatCurrency } from "@/lib/utils";
import { useCurrentUser, useTrendoraStore } from "@/store/trendora-store";

export function ProfilePage() {
  const currentUser = useCurrentUser();
  const products = useTrendoraStore((state) => state.products);
  const orders = useTrendoraStore((state) => state.orders);
  const wishlistIds = useTrendoraStore((state) => state.wishlist);
  const signOut = useTrendoraStore((state) => state.signOut);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <EmptyState
          title="Login to view your profile"
          description="Your personal details, wishlist, and order history live here. Use the demo account or create a new one."
          actionLabel="Go to Login"
          href="/login"
        />
      </div>
    );
  }

  const userOrders = orders.filter((order) => order.userId === currentUser.id);
  const wishlistProducts = products.filter((product) => wishlistIds.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 lg:px-8">
      <div className="surface flex flex-col gap-6 rounded-[2rem] border p-8 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">My Profile</p>
          <h1 className="mt-4 font-display text-4xl font-semibold">{currentUser.name}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {currentUser.email} · {currentUser.phone} · Joined {format(new Date(currentUser.joinedAt), "dd MMM yyyy")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full border px-5 py-3 text-sm font-semibold">Continue Shopping</Link>
          <button type="button" onClick={signOut} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            Logout
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-semibold">Wishlist</h2>
          <span className="text-sm text-slate-500">{wishlistProducts.length} saved items</span>
        </div>
        {wishlistProducts.length ? (
          <ProductGrid products={wishlistProducts} />
        ) : (
          <EmptyState
            title="No saved items yet"
            description="Save products to your wishlist to quickly revisit favorites and improve Trendora's recommendation sections."
            actionLabel="Browse Products"
            href="/products"
          />
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-semibold">Order History</h2>
          <span className="text-sm text-slate-500">{userOrders.length} orders</span>
        </div>
        <div className="grid gap-4">
          {userOrders.length ? (
            userOrders.map((order) => (
              <div key={order.id} className="surface rounded-[2rem] border p-6 shadow-soft">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{order.id}</p>
                    <h3 className="mt-2 font-semibold">{format(new Date(order.createdAt), "dd MMM yyyy")}</h3>
                    <p className="mt-1 text-sm text-slate-500">{order.status} · {order.paymentMethod}</p>
                  </div>
                  <p className="text-lg font-semibold">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No orders yet"
              description="Once you complete checkout, your order history will appear here with totals and status updates."
              actionLabel="Start Shopping"
              href="/products"
            />
          )}
        </div>
      </section>
    </div>
  );
}
