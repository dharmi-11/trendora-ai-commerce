"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { getSimilarProducts } from "@/lib/ai";
import { formatCurrency } from "@/lib/utils";
import { useCurrentUser, useTrendoraStore } from "@/store/trendora-store";

export function ProductDetailPage({ slug }: { slug: string }) {
  const products = useTrendoraStore((state) => state.products);
  const addToCart = useTrendoraStore((state) => state.addToCart);
  const toggleWishlist = useTrendoraStore((state) => state.toggleWishlist);
  const wishlist = useTrendoraStore((state) => state.wishlist);
  const markViewed = useTrendoraStore((state) => state.markViewed);
  const addReview = useTrendoraStore((state) => state.addReview);
  const currentUser = useCurrentUser();
  const [review, setReview] = useState({ rating: "5", comment: "" });

  const product = products.find((item) => item.slug === slug);

  useEffect(() => {
    if (product) {
      markViewed(product.id);
    }
  }, [markViewed, product]);

  const similarProducts = useMemo(
    () => (product ? getSimilarProducts(products, product) : []),
    [product, products],
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Unavailable</p>
        <h1 className="mt-4 font-display text-5xl font-semibold">This product could not be found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          The item may have been removed during admin editing. Browse the catalog to discover other Trendora picks.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/products" className="rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white">
            Back to Products
          </Link>
          <Link href="/" className="rounded-full border px-6 py-4 text-sm font-semibold">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {product.images.map((image) => (
            <div key={image} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border shadow-soft">
              <Image src={image} alt={product.name} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="surface rounded-[2rem] border p-8 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{product.category}</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">{product.name}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-semibold">{formatCurrency(product.discountPrice ?? product.price)}</span>
              {product.discountPrice ? <span className="text-lg text-slate-400 line-through">{formatCurrency(product.price)}</span> : null}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-2 text-sm text-gold">
              <Star className="h-4 w-4 fill-current" />
              {product.rating.toFixed(1)} rating
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => addToCart(product.id)} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white">
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
            <button type="button" onClick={() => toggleWishlist(product.id)} className="inline-flex items-center gap-2 rounded-full border px-6 py-4 text-sm font-semibold">
              <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current text-accent" : ""}`} />
              {wishlist.includes(product.id) ? "Saved" : "Add to Wishlist"}
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border bg-white/70 p-4 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Colors</p>
              <p className="mt-2 text-sm">{product.colors.join(", ")}</p>
            </div>
            <div className="rounded-[1.5rem] border bg-white/70 p-4 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sizes</p>
              <p className="mt-2 text-sm">{product.sizes?.join(", ") ?? "Standard"}</p>
            </div>
            <div className="rounded-[1.5rem] border bg-white/70 p-4 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Stock</p>
              <p className="mt-2 text-sm">{product.stock} available</p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Reviews"
          title="Ratings and reviews"
          description="Customer feedback builds trust and strengthens decision-making on the product detail page."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-4">
            {product.reviews.map((entry) => (
              <div key={entry.id} className="surface rounded-[2rem] border p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{entry.userName}</h3>
                  <span className="text-sm text-slate-500">{entry.rating.toFixed(1)} / 5</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{entry.comment}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!currentUser) return;
              addReview(product.id, {
                userName: currentUser.name,
                rating: Number(review.rating),
                comment: review.comment,
              });
              setReview({ rating: "5", comment: "" });
            }}
            className="surface h-fit rounded-[2rem] border p-6 shadow-soft"
          >
            <h3 className="font-semibold">Write a review</h3>
            <p className="mt-2 text-sm text-slate-500">{currentUser ? "Share your experience with this product." : "Login to leave a review."}</p>
            <select value={review.rating} onChange={(event) => setReview((current) => ({ ...current, rating: event.target.value }))} className="mt-4 w-full rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/70" disabled={!currentUser}>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
            </select>
            <textarea value={review.comment} onChange={(event) => setReview((current) => ({ ...current, comment: event.target.value }))} rows={5} className="mt-4 w-full rounded-[1.5rem] border bg-white/70 px-4 py-3 dark:bg-slate-900/70" placeholder="Loved the quality, fit, and finish..." disabled={!currentUser} />
            <button type="submit" disabled={!currentUser || !review.comment.trim()} className="mt-4 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              Submit Review
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="AI Match"
          title="Similar Products"
          description="Rule-based matching looks at category, tags, and price range to suggest relevant alternatives."
        />
        <ProductGrid products={similarProducts} />
      </section>
    </div>
  );
}
