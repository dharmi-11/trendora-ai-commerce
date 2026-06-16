"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { useTrendoraStore } from "@/store/trendora-store";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useTrendoraStore((state) => state.addToCart);
  const toggleWishlist = useTrendoraStore((state) => state.toggleWishlist);
  const wishlist = useTrendoraStore((state) => state.wishlist);

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group overflow-hidden rounded-[2rem] border bg-white/90 shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-glow dark:bg-slate-950/80">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-soft transition hover:scale-105 dark:bg-slate-950/85 dark:text-slate-100"
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current text-accent" : ""}`} />
        </button>
        {product.discountPrice ? (
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{product.category}</span>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Star className="h-4 w-4 fill-gold text-gold" />
            {product.rating.toFixed(1)}
          </div>
        </div>
        <div>
          <Link href={`/products/${product.slug}`} className="block font-display text-2xl font-semibold leading-tight">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.shortNote}</p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{formatCurrency(product.discountPrice ?? product.price)}</span>
              {product.discountPrice ? (
                <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-500">{product.stock} pieces left in stock</p>
          </div>
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:border-accent hover:bg-accent hover:text-white dark:border-slate-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
