"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";

import { SearchBar } from "@/components/search/search-bar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCurrentUser, useTrendoraStore } from "@/store/trendora-store";

export function Header() {
  const hydrated = useHydrated();
  const currentUser = useCurrentUser();
  const cartCount = useTrendoraStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useTrendoraStore((state) => state.wishlist.length);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/profile", label: "Profile" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-[hsl(var(--background)/0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-8">
        <Link href="/" className="min-w-fit">
          <span className="font-display text-3xl font-semibold">Trendora</span>
          <span className="block text-[10px] uppercase tracking-[0.4em] text-slate-500">AI Fashion Commerce</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-accent dark:text-slate-300">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 lg:block">
          <SearchBar compact />
        </div>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link href="/wishlist" className="rounded-full border px-4 py-3 text-sm font-semibold">
            Wishlist {hydrated ? `(${wishlistCount})` : ""}
          </Link>
          <Link href="/cart" className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white">
            Cart {hydrated ? `(${cartCount})` : ""}
          </Link>
          <Link href={currentUser ? "/profile" : "/login"} className="rounded-full border px-4 py-3 text-sm font-semibold">
            {currentUser ? currentUser.name.split(" ")[0] : "Login"}
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-12 w-12 items-center justify-center rounded-full border lg:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/20 px-4 pb-5 lg:hidden">
          <div className="py-4">
            <SearchBar compact />
          </div>
          <div className="grid gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border px-4 py-3 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/cart" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white" onClick={() => setMenuOpen(false)}>
                <ShoppingBag className="h-4 w-4" />
                Cart {hydrated ? `(${cartCount})` : ""}
              </Link>
              <Link href={currentUser ? "/profile" : "/login"} className="flex h-11 w-11 items-center justify-center rounded-full border" onClick={() => setMenuOpen(false)}>
                <UserRound className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
