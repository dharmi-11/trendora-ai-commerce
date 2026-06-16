"use client";

import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { useTrendoraStore } from "@/store/trendora-store";

export default function Page() {
  const products = useTrendoraStore((state) => state.products);
  const wishlist = useTrendoraStore((state) => state.wishlist);
  const wishlistedProducts = products.filter((product) => wishlist.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Favorites</p>
        <h1 className="mt-4 font-display text-5xl font-semibold">Your saved style picks</h1>
      </div>
      {wishlistedProducts.length ? (
        <ProductGrid products={wishlistedProducts} />
      ) : (
        <EmptyState
          title="Your wishlist is empty"
          description="Save standout products here so Trendora can tailor your recommendations more effectively."
          actionLabel="Browse Products"
          href="/products"
        />
      )}
    </div>
  );
}
