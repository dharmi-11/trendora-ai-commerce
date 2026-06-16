"use client";

import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { getSearchSuggestions } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useTrendoraStore } from "@/store/trendora-store";

interface SearchBarProps {
  initialValue?: string;
  compact?: boolean;
  className?: string;
}

export function SearchBar({ initialValue = "", compact = false, className }: SearchBarProps) {
  const router = useRouter();
  const products = useTrendoraStore((state) => state.products);
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => getSearchSuggestions(products, query), [products, query]);

  function submitSearch(value: string) {
    router.push(`/products?q=${encodeURIComponent(value)}`);
    setFocused(false);
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border border-white/60 bg-white/90 px-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/85",
          compact ? "h-12" : "h-14",
        )}
      >
        <Search className="h-4 w-4 text-slate-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setFocused(false), 120);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submitSearch(query);
            }
          }}
          placeholder="Search black dress, skincare, bags under 1000..."
          className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => submitSearch(query)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          <Sparkles className="h-4 w-4" />
          Search
        </button>
      </div>

      {focused && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-30 rounded-3xl border bg-white/95 p-3 shadow-glow dark:bg-slate-950/95">
          <p className="px-3 pb-2 text-xs uppercase tracking-[0.3em] text-slate-400">Smart Suggestions</p>
          <div className="space-y-1">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.type}-${suggestion.value}`}
                type="button"
                onClick={() => {
                  setQuery(suggestion.value);
                  submitSearch(suggestion.value);
                }}
                className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <span className="text-sm font-medium">{suggestion.label}</span>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400">{suggestion.type}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
