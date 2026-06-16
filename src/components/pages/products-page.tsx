"use client";

import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { categories } from "@/lib/constants";
import { smartSearchProducts } from "@/lib/search";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/search/search-bar";
import { SectionHeading } from "@/components/common/section-heading";
import { useTrendoraStore } from "@/store/trendora-store";

export function ProductsPage() {
  const searchParams = useSearchParams();
  const products = useTrendoraStore((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "All");
  const [minRating, setMinRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState("5000");

  const query = searchParams.get("q") ?? "";

  const filteredProducts = useMemo(() => {
    return smartSearchProducts(products, query).filter((product) => {
      const effectivePrice = product.discountPrice ?? product.price;
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesRating = product.rating >= Number(minRating);
      const matchesPrice = effectivePrice <= Number(maxPrice);
      return matchesCategory && matchesRating && matchesPrice;
    });
  }, [maxPrice, minRating, products, query, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 lg:px-8">
      <SectionHeading
        eyebrow="Catalog"
        title="Search, filter, and discover products with intent-aware UX"
        description="Use category, price, and rating filters together with natural-language search to find exactly what you need."
      />

      <SearchBar initialValue={query} />

      <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
        <aside className="surface h-fit rounded-[2rem] border p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Category</label>
              <div className="mt-3 grid gap-2">
                {["All", ...categories].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      selectedCategory === category
                        ? "bg-accent text-white"
                        : "border bg-white/70 hover:border-accent dark:bg-slate-900/70"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Max Price</label>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="mt-4 w-full accent-[hsl(var(--accent))]"
              />
              <p className="mt-2 text-sm text-slate-500">Up to Rs. {maxPrice}</p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(event) => setMinRating(event.target.value)}
                className="mt-3 w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm dark:bg-slate-900/70"
              >
                <option value="0">Any rating</option>
                <option value="3.5">3.5 and above</option>
                <option value="4">4 and above</option>
                <option value="4.5">4.5 and above</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <p className="text-sm text-slate-500">{filteredProducts.length} products found</p>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
