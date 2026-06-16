import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
}

export function EmptyState({ title, description, actionLabel, href }: EmptyStateProps) {
  return (
    <div className="surface rounded-[2rem] border p-10 text-center shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">Nothing here yet</p>
      <h3 className="mt-4 font-display text-3xl font-semibold">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
