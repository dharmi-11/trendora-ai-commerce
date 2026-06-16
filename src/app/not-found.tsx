import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">This style pick is unavailable</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
        The page you requested could not be found. Return to the homepage or browse the full Trendora catalog.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white">Go Home</Link>
        <Link href="/products" className="rounded-full border px-6 py-4 text-sm font-semibold">Shop Products</Link>
      </div>
    </div>
  );
}
