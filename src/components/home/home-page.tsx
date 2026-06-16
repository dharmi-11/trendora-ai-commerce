"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, HeartHandshake, ShieldCheck, Sparkles, Wand2 } from "lucide-react";

import { getRecommendedForUser, getTrendingProducts, getYouMayAlsoLike } from "@/lib/ai";
import { categories, heroHighlights, offerCards } from "@/lib/constants";
import { useTrendoraStore } from "@/store/trendora-store";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/search/search-bar";
import { SectionHeading } from "@/components/common/section-heading";

export function HomePage() {
  const products = useTrendoraStore((state) => state.products);
  const wishlist = useTrendoraStore((state) => state.wishlist);
  const cart = useTrendoraStore((state) => state.cart);
  const recentlyViewed = useTrendoraStore((state) => state.recentlyViewed);

  const recommended = getRecommendedForUser(products, wishlist, cart, recentlyViewed);
  const trending = getTrendingProducts(products);
  const mayAlsoLike = getYouMayAlsoLike(products, cart);
  const featured = products.filter((product) => product.featured).slice(0, 6);

  return (
    <div className="space-y-24 pb-24">
      <section className="grid-fade relative overflow-hidden border-b border-white/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent shadow-soft dark:bg-slate-950/70">
              <Sparkles className="h-4 w-4" />
              User-Centric AI Commerce
            </span>
            <div className="space-y-5">
              <h1 className="font-display text-5xl font-semibold leading-none text-balance md:text-7xl">
                Style discovery that feels
                <span className="gradient-text"> personal, premium, and smart.</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Trendora combines polished shopping UI, responsive UX, smart search, rule-based AI recommendations,
                and an interactive assistant to make fashion and lifestyle discovery effortless.
              </p>
            </div>

            <SearchBar className="max-w-2xl" />

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-1 hover:bg-accent-dark"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border px-6 py-4 text-sm font-semibold">
                View Admin Dashboard
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {heroHighlights.map((highlight) => (
                <div key={highlight} className="surface rounded-[1.5rem] border p-4 shadow-soft">
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div className="surface rounded-[2rem] border p-6 shadow-glow">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">AI Layers</p>
              <div className="mt-5 grid gap-4">
                {[
                  { icon: BrainCircuit, title: "Recommended For You", text: "Matches category interest, recent views, and budget patterns." },
                  { icon: Wand2, title: "Smart Search", text: "Interprets plain-language queries like 'bags under 1000' instantly." },
                  { icon: HeartHandshake, title: "Shopping Assistant", text: "Suggests gifts, occasionwear, skincare, and budget picks." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border bg-white/70 p-4 dark:bg-slate-900/60">
                    <item.icon className="h-5 w-5 text-accent" />
                    <h3 className="mt-3 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface rounded-[2rem] border p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Trust & Flow</p>
              <div className="mt-4 flex items-start gap-4 rounded-[1.5rem] border bg-white/65 p-4 dark:bg-slate-900/60">
                <ShieldCheck className="mt-1 h-5 w-5 text-moss" />
                <div>
                  <h3 className="font-semibold">Smooth checkout and protected profile access</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Clear forms, friendly empty states, and demo authentication flows built for presentation and live demo confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Curated fashion and lifestyle zones"
          description="Browse Trendora’s core categories with fast filtering, search, and recommendation-friendly product metadata."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category, index) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="surface group rounded-[2rem] border p-6 shadow-soft transition hover:-translate-y-2 hover:shadow-glow"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">0{index + 1}</p>
              <h3 className="mt-8 font-display text-3xl font-semibold">{category}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Explore products tagged for better smart search and AI-assisted suggestions.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <SectionHeading
          eyebrow="AI Recommendations"
          title="Recommended For You"
          description="Powered by rule-based logic using wishlist interest, cart preferences, view patterns, and pricing alignment."
        />
        <ProductGrid products={recommended.slice(0, 6)} />
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <SectionHeading
          eyebrow="Featured"
          title="Signature picks from the Trendora edit"
          description="Premium presentation-ready product cards with offer tags, ratings, and quick actions."
        />
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <SectionHeading
          eyebrow="Trending Products"
          title="Trending Products"
          description="High-interest products ranked by trend momentum, sales activity, and shopper engagement signals."
        />
        <ProductGrid products={trending} />
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <SectionHeading
          eyebrow="Offers"
          title="Seasonal promotions with premium storytelling"
          description="Designed to enrich the landing experience and guide users into high-intent collections."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {offerCards.map((offer) => (
            <div key={offer.title} className="surface rounded-[2rem] border p-6 shadow-soft">
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dark">{offer.chip}</span>
              <h3 className="mt-6 font-display text-3xl font-semibold">{offer.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{offer.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
        <SectionHeading
          eyebrow="You May Also Like"
          title="You May Also Like"
          description="Accessory, beauty, and styling combinations generated from what users are already considering."
        />
        <ProductGrid products={mayAlsoLike.slice(0, 6)} />
      </section>
    </div>
  );
}
