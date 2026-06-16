import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/30 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-3xl font-semibold">Trendora</p>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">
            An AI-assisted e-commerce experience designed around discovery, clarity, and responsive fashion-first UX.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">Explore</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/products">Shop All</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/admin">Admin Dashboard</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">Demo Credentials</p>
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>User: anaya@trendora.in / trendora123</p>
            <p>Admin: admin@trendora.in / admin123</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
