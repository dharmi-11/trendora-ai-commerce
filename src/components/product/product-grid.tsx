import type { Product } from "@/types";

import { EmptyState } from "@/components/common/empty-state";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <EmptyState
        title="No matching products"
        description="Try a different keyword, budget, or category. Smart search works well with queries like 'bags under 1000' or 'party wear'."
        actionLabel="Explore trending picks"
        href="/products"
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
